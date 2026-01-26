import { useState, useEffect, useMemo, useCallback, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

interface Size {
  w: number;
  h: number;
}

interface PositionedItem {
  id: string;
  genre: string | null;
  position: Position;
  size: Size;
  anchorX?: number; // Reference to genre anchor for collision resolution
  anchorY?: number;
  zoneBounds?: { yMin: number; yMax: number }; // Hard bounds for this item's zone (mobile only)
  angleFromAnchor?: number; // Radians - used for tilt calculation
  tierIndex?: number; // Which distance tier (for debugging)
}

interface CloudItem {
  id: string;
  cluster_key: string | null;
  answer: string;
  enriched_answer?: string | null;
  genre: string | null;
}

interface UseGenreClusteredOptions {
  mobileHeaderHeightPx?: number; // Height of fixed header content in pixels
}

interface GenreClusterResult {
  positions: Map<string, Position>;
  genreAnchors: Map<string, Position>;
  genreZoneBounds: Map<string, { yMin: number; yMax: number }>; // Vertical bounds per genre (mobile)
  genreCount: number; // Number of unique genres (for container height calculation)
  applyCohesionForce: () => void; // Gradually pull scattered books back toward clusters
  itemTilts: Map<string, number>; // Calculated tilt for each item (degrees)
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// Estimate item size based on text length - allow full text display
const estimateItemSize = (text: string, isMobile: boolean): Size => {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const textLen = (text?.length ?? 0) + 4; // Account for emojis/padding
  
  // Calculate width based on text - no max truncation
  const charWidth = isMobile ? 7 : 7.5;
  const basePadding = isMobile ? 32 : 40;
  const calculatedWidth = basePadding + textLen * charWidth;
  
  // Reasonable limits but generous enough for most titles
  const maxWidthPx = isMobile ? 180 : 280; // Slightly narrower on mobile to help edge spacing
  const minWidthPx = isMobile ? 80 : 100;
  const widthPx = clamp(calculatedWidth, minWidthPx, maxWidthPx);
  const heightPx = isMobile ? 36 : 38;

  return {
    w: (widthPx / Math.max(1, vw)) * 100,
    h: (heightPx / Math.max(1, vh)) * 100,
  };
};

// Genre cluster zones - each genre gets its own area on desktop
// Zones are distributed across both sides of the central CTA
// Compact vertical spacing to avoid large empty areas
const GENRE_ZONES_DESKTOP: { xCenter: number; yCenter: number; radius: number }[] = [
  // IMPORTANT: anchors must not sit too close to the viewport edges,
  // otherwise half the circle gets clamped and the cluster appears to "avoid" that side.
  // These x values are chosen so clusters can expand left/right symmetrically.
  // Left column
  { xCenter: 22, yCenter: 25, radius: 7 },
  { xCenter: 22, yCenter: 50, radius: 7 },
  { xCenter: 22, yCenter: 75, radius: 7 },
  // Right column
  { xCenter: 78, yCenter: 25, radius: 7 },
  { xCenter: 78, yCenter: 50, radius: 7 },
  { xCenter: 78, yCenter: 75, radius: 7 },
  // Inner (smaller) zones
  { xCenter: 32, yCenter: 35, radius: 6 },
  { xCenter: 32, yCenter: 65, radius: 6 },
  { xCenter: 68, yCenter: 35, radius: 6 },
  { xCenter: 68, yCenter: 65, radius: 6 },
];

// Mobile zones - each zone represents a strict vertical band
// Books CANNOT leave their band - this prevents constellation overlap
interface MobileZone {
  xCenter: number;
  yCenter: number;
  yMin: number; // Hard upper bound for books in this zone
  yMax: number; // Hard lower bound for books in this zone
  radius: number;
}

// Clock-face positioning: TRUE circular distribution around the star
// Books are placed evenly around the constellation anchor in a full 360° circle.
// Angles in degrees where 0° = 12 o'clock, 90° = 3 o'clock, 180° = 6 o'clock, 270° = 9 o'clock.

// Generate clock positions for N items - evenly distributed around the circle
const generateClockPositions = (count: number): number[] => {
  if (count <= 4) {
    // For 1-4 items, use cardinal positions: 6, 12, 3, 9 o'clock
    return [180, 0, 90, 270].slice(0, count);
  }
  if (count <= 8) {
    // For 5-8 items, add diagonal positions
    return [180, 0, 90, 270, 135, 315, 45, 225].slice(0, count);
  }
  // For more items, distribute evenly around the circle
  const positions: number[] = [];
  const angleStep = 360 / count;
  for (let i = 0; i < count; i++) {
    // Start from 180° (6 o'clock) and go clockwise
    positions.push((180 + i * angleStep) % 360);
  }
  return positions;
};

// PHYLLOTACTIC (Fibonacci-based) TIER GENERATION
// Creates organic spiral-like distance distribution that avoids clustering
// Uses Fibonacci sequence for tier assignment - creates natural visual rhythm
interface TierInfo {
  tier: number;
  distance: number; // 0.0 to 1.0 normalized distance from center
}

const generateFibonacciTiers = (count: number): TierInfo[] => {
  if (count === 0) return [];
  
  // Distance tiers with more granular separation
  // 6 tiers for nuanced spacing: very close, close, mid-close, mid-far, far, very far
  const tierDistances = [0.28, 0.42, 0.56, 0.72, 0.86, 1.0];
  
  // Fibonacci-based assignment - creates natural spiral pattern
  // Items are assigned to tiers based on their position in Fibonacci sequence mod tier count
  const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
  
  const result: TierInfo[] = [];
  
  for (let i = 0; i < count; i++) {
    // Use Fibonacci-influenced tier selection
    // This creates a pattern: 1,2,3,5,8... mod tierCount for organic spread
    const fibIndex = i % fibonacci.length;
    const fibValue = fibonacci[fibIndex];
    
    // Add index-based variation for uniqueness
    const tierIndex = (fibValue + Math.floor(i / 3)) % tierDistances.length;
    
    // Add micro-variation based on item's absolute position
    // This prevents items in same tier from having identical distances
    const microVariation = ((i * 137.5) % 10) / 100; // ±0.05 based on golden angle
    const baseDistance = tierDistances[tierIndex];
    const distance = clamp(baseDistance + (microVariation - 0.05), 0.2, 1.0);
    
    result.push({
      tier: tierIndex,
      distance,
    });
  }
  
  return result;
};

// Desktop uses golden angle spiral - creates nice organic distribution
const CLOCK_POSITIONS_DESKTOP = [
  180, 0, 90, 270, 60, 330, 210, 150, 30, 300, 240, 120,
  15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345,
];

// Generate mobile zones with sizes PROPORTIONAL to book count
// Larger genres get more vertical space
const generateMobileZones = (
  startYPercent: number, 
  numGenres: number,
  genreBookCounts?: Map<string, number> // Optional: book counts per genre for proportional sizing
): MobileZone[] => {
  const zoneCount = Math.max(1, numGenres);
  const zones: MobileZone[] = [];

  if (!genreBookCounts || genreBookCounts.size === 0) {
    // Fallback: equal zones if no book counts provided
    const bandHeight = 100 / zoneCount;
    for (let i = 0; i < zoneCount; i++) {
      const yMin = i * bandHeight;
      const yMax = (i + 1) * bandHeight;
      zones.push({
        xCenter: 50,
        yCenter: yMin + bandHeight * 0.3, // Anchor in upper third
        yMin,
        yMax,
        radius: 6,
      });
    }
    return zones;
  }

  // PROPORTIONAL sizing: genres with more books get more space
  const totalBooks = Array.from(genreBookCounts.values()).reduce((a, b) => a + b, 0);
  const sortedGenres = Array.from(genreBookCounts.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .map(([genre]) => genre);

  let currentY = 0;
  
  sortedGenres.forEach((genre) => {
    const bookCount = genreBookCounts.get(genre) || 1;
    
    // Calculate proportional height with minimum and maximum bounds
    // Base: proportional to book count, but ensure minimum space for small genres
    const proportionalHeight = (bookCount / totalBooks) * 100;
    const minHeight = 12; // Minimum 12% for any genre
    const maxHeight = 45; // Maximum 45% for any single genre
    const bandHeight = clamp(proportionalHeight, minHeight, maxHeight);
    
    const yMin = currentY;
    const yMax = currentY + bandHeight;
    
    // Position anchor in upper portion - more room below for books to cascade
    // Larger genres: anchor higher (25% down) to maximize downward spread
    // Smaller genres: anchor more centered (35% down)
    const anchorRatio = bookCount > 8 ? 0.22 : bookCount > 4 ? 0.28 : 0.35;
    const yCenter = yMin + bandHeight * anchorRatio;
    
    zones.push({
      xCenter: 50,
      yCenter,
      yMin,
      yMax,
      radius: 6,
    });
    
    currentY = yMax;
  });

  // Normalize to fill exactly 100% (in case of rounding)
  if (zones.length > 0 && currentY !== 100) {
    const scale = 100 / currentY;
    let runningY = 0;
    zones.forEach(zone => {
      const height = (zone.yMax - zone.yMin) * scale;
      zone.yMin = runningY;
      zone.yMax = runningY + height;
      zone.yCenter = zone.yMin + height * (zone.yCenter - zone.yMin) / (zone.yMax - zone.yMin) * scale;
      // Recalculate yCenter based on book count
      runningY = zone.yMax;
    });
  }

  return zones;
};

export function useGenreClusteredPositions(
  items: CloudItem[], 
  options: UseGenreClusteredOptions = {}
): GenreClusterResult {
  const { mobileHeaderHeightPx = 280 } = options; // Default header height ~280px
  const [positions, setPositions] = useState<Map<string, Position>>(new Map());
  const [genreAnchors, setGenreAnchors] = useState<Map<string, Position>>(new Map());
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth < 768 // True mobile only (not tablet)
  );

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (nowMobile !== isMobile) {
        setIsMobile(nowMobile);
        setPositions(new Map());
        setGenreAnchors(new Map());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Calculate mobile start position based on header height and viewport
  // Start constellations at a reasonable position - not too far down
  const mobileStartY = useMemo(() => {
    if (typeof window === 'undefined') return 12;
    // Start at a fixed percentage that works well below the header content
    // The container already has pt-20 + header content, so we start items from ~10-15% of the cloud zone
    return 12;
  }, []);

  // Group items by genre (must come before zones calculation)
  const genreGroups = useMemo(() => {
    const groups: Record<string, CloudItem[]> = {};
    items.forEach(item => {
      const genre = item.genre || "Uncategorized";
      if (!groups[genre]) groups[genre] = [];
      groups[genre].push(item);
    });
    return groups;
  }, [items]);

  // Sort genres by popularity (most books first) for consistent ordering
  const sortedGenresByPopularity = useMemo(() => {
    return Object.entries(genreGroups)
      .sort((a, b) => b[1].length - a[1].length) // Descending by count
      .map(([genre]) => genre);
  }, [genreGroups]);

  const numGenres = sortedGenresByPopularity.length;
  
  // Build book counts map for proportional zone sizing
  const genreBookCounts = useMemo(() => {
    const counts = new Map<string, number>();
    Object.entries(genreGroups).forEach(([genre, items]) => {
      counts.set(genre, items.length);
    });
    return counts;
  }, [genreGroups]);
  
  const zones = useMemo(() => 
    isMobile 
      ? generateMobileZones(mobileStartY, numGenres, genreBookCounts) 
      : GENRE_ZONES_DESKTOP.map(z => ({ ...z, yMin: 0, yMax: 100 })), 
    [isMobile, mobileStartY, numGenres, genreBookCounts]
  );
  const minSpacing = isMobile ? 1.5 : 1.5; // 1.5% vh minimum gap between items

  // Assign zones to genres - ensure each genre gets a unique zone
  const genreZoneAssignments = useMemo(() => {
    const assignments = new Map<string, number>();
    const genres = Object.keys(genreGroups);
    const usedZones = new Set<number>();
    
    genres.forEach((genre, idx) => {
      // Hash the genre name for initial zone preference
      const hash = genre.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
      let preferredZone = Math.abs(hash) % zones.length;
      
      // Find an unused zone, starting from preferred
      let zoneIdx = preferredZone;
      let attempts = 0;
      while (usedZones.has(zoneIdx) && attempts < zones.length) {
        zoneIdx = (zoneIdx + 1) % zones.length;
        attempts++;
      }
      
      usedZones.add(zoneIdx);
      assignments.set(genre, zoneIdx);
    });
    
    return assignments;
  }, [genreGroups, zones]);

  // Check overlap between two items
  const checkOverlap = useCallback((a: PositionedItem, b: PositionedItem): boolean => {
    const overlapX = Math.abs(a.position.x - b.position.x) < (a.size.w / 2 + b.size.w / 2 + minSpacing);
    const overlapY = Math.abs(a.position.y - b.position.y) < (a.size.h / 2 + b.size.h / 2 + minSpacing);
    return overlapX && overlapY;
  }, [minSpacing]);

  // Position items around their genre's anchor point using TRUE CIRCULAR clock-face pattern
  // Books are distributed evenly around the star in a full 360° circle
  // ADAPTIVE RADIUS: Larger genres get more space to prevent crowding
  const positionItemsAroundAnchor = useCallback((
    zoneItems: CloudItem[],
    anchor: { x: number; y: number },
    baseMaxRadius: number,
    anchorExclusionRadius: number, // Keep items away from anchor center
    zoneBounds?: { yMin: number; yMax: number } // Mobile only - strict vertical limits
  ): PositionedItem[] => {
    const positioned: PositionedItem[] = [];
    
    // ADAPTIVE RADIUS based on genre size
    // More books = larger radius to give them room to spread
    const itemCount = zoneItems.length;
    const radiusScale = 1 + Math.log2(Math.max(1, itemCount)) * 0.25; // 1 book=1x, 4 books=1.5x, 8 books=1.75x, 16 books=2x
    const adaptiveMaxRadius = baseMaxRadius * radiusScale;
    
    // ZERO horizontal margins - let items use full width
    // Only the final clamp prevents going off-screen
    const safeMarginX = 1; // Minimal - just prevent clipping
    const safeMarginY = isMobile ? 1 : 2;
    
    // Generate clock positions based on number of items for even distribution
    const clockPositions = isMobile ? generateClockPositions(zoneItems.length) : CLOCK_POSITIONS_DESKTOP;
    
    // PHYLLOTACTIC (Fibonacci-based) TIER ASSIGNMENT
    // Instead of simple round-robin, use Fibonacci sequence for more organic distribution
    // This creates natural spiral-like patterns that avoid clustering
    const fibonacciTiers = generateFibonacciTiers(zoneItems.length);
    
    // Seeded random based on item ID for angle jitter
    const seededRandom = (seed: string, index: number): number => {
      const hash = seed.split('').reduce((a, b, i) => {
        return ((a << 5) - a + b.charCodeAt(0) + index * 17) & 0x7fffffff;
      }, 0);
      return (hash % 1000) / 1000;
    };
    
    // CASCADING DIAGONAL PATTERN
    // Books flow down in a zig-zag pattern, alternating left/right from center
    // Mimics the organic hand-arranged layout from the user's reference
    const cascadeConfig = {
      // Vertical step between each book (as % of zone height)
      verticalStepBase: isMobile ? 8 : 6,
      // Horizontal offset amplitude (how far left/right from center)
      horizontalAmplitude: isMobile ? 18 : 15,
      // How much to vary the horizontal offset per row
      horizontalJitter: isMobile ? 8 : 6,
      // Vertical jitter for organic feel
      verticalJitter: isMobile ? 2 : 1.5,
    };
    
    zoneItems.forEach((item, idx) => {
      const displayText = item.enriched_answer || item.answer;
      const size = estimateItemSize(displayText, isMobile);
      
      // Seeded random for consistent positioning based on item ID
      const itemHash = item.id.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0x7fffffff, 0);
      const rand1 = (itemHash % 1000) / 1000; // 0-1
      const rand2 = ((itemHash * 31) % 1000) / 1000; // Different seed
      const rand3 = ((itemHash * 17) % 1000) / 1000; // Another seed
      
      if (isMobile && zoneBounds) {
        // MOBILE: ORGANIC SCATTER using FULL zone space
        // Anchor is positioned in upper portion of zone - books spread mostly below but also above
        const zoneHeight = zoneBounds.yMax - zoneBounds.yMin;
        const itemCount = zoneItems.length;
        
        // Calculate available space above and below anchor
        const spaceAbove = anchor.y - zoneBounds.yMin;
        const spaceBelow = zoneBounds.yMax - anchor.y;
        
        // Scatter radius - use nearly full zone space
        const scatterRadiusX = 38 + rand1 * 8; // 38-46% horizontal spread
        
        // Vertical radius: asymmetric - more space below anchor for cascading
        // But still use space above for some books
        const radiusAbove = spaceAbove * 0.85; // Use 85% of space above
        const radiusBelow = spaceBelow * 0.9;  // Use 90% of space below
        
        // Random angle - full 360° but bias slightly downward for natural cascade
        const baseAngle = rand1 * Math.PI * 2;
        // Slight downward bias for larger clusters
        const downwardBias = itemCount > 6 ? 0.15 : 0;
        const angle = baseAngle + (rand2 < 0.4 ? downwardBias : 0);
        
        // Distance from anchor - use more of the radius
        const distanceFactor = 0.2 + rand2 * 0.8; // 20-100% of radius
        
        // Calculate position with asymmetric vertical radius
        const xOffset = Math.cos(angle) * scatterRadiusX * distanceFactor;
        const yDirection = Math.sin(angle);
        const yRadius = yDirection < 0 ? radiusAbove : radiusBelow;
        const yOffset = yDirection * yRadius * distanceFactor;
        
        let x = anchor.x + xOffset;
        let y = anchor.y + yOffset;
        
        // Add jitter for uniqueness
        x += (rand3 - 0.5) * 12;
        y += (rand1 * rand3 - 0.25) * 8;
        
        // Clamp to zone - no extra margins
        x = clamp(x, size.w / 2, 100 - size.w / 2);
        y = clamp(y, zoneBounds.yMin + size.h / 2, zoneBounds.yMax - size.h / 2);
        
        positioned.push({
          id: item.id,
          genre: item.genre,
          position: { x, y },
          size,
          anchorX: anchor.x,
          anchorY: anchor.y,
          zoneBounds,
          angleFromAnchor: angle,
          tierIndex: idx % 6,
        });
      } else {
        // DESKTOP: CASCADING DIAGONAL with more horizontal spread
        const itemCount = zoneItems.length;
        
        // Start from anchor and cascade in a diagonal pattern
        const startY = anchor.y - adaptiveMaxRadius * 0.4;
        const adaptiveVerticalStep = Math.max(3, adaptiveMaxRadius * 0.12);
        
        let y = startY + idx * adaptiveVerticalStep;
        y += (rand1 - 0.5) * cascadeConfig.verticalJitter * 2;
        
        // Zig-zag pattern with golden angle influence for variety
        const zigZagDirection = idx % 2 === 0 ? -1 : 1;
        const baseOffset = adaptiveMaxRadius * 0.5;
        const jitterOffset = (rand2 - 0.5) * cascadeConfig.horizontalJitter * 2;
        
        // Add Fibonacci-influenced variation
        const fibInfluence = fibonacciTiers[idx]?.distance ?? 0.5;
        const fibOffset = (fibInfluence - 0.5) * 8;
        
        let x = anchor.x + zigZagDirection * (baseOffset + jitterOffset + fibOffset);
        
        x = clamp(x, size.w / 2 + safeMarginX, 100 - size.w / 2 - safeMarginX);
        y = clamp(y, size.h / 2 + safeMarginY, 100 - size.h / 2 - safeMarginY);
        
        const dx = x - anchor.x;
        const dy = y - anchor.y;
        const angleFromAnchor = Math.atan2(dy, dx);
        
        positioned.push({
          id: item.id,
          genre: item.genre,
          position: { x, y },
          size,
          anchorX: anchor.x,
          anchorY: anchor.y,
          angleFromAnchor,
          tierIndex: idx % 6,
        });
      }
    });
    
    return positioned;
  }, [isMobile]);

  // Resolve collisions with edge-aware pushing and anchor exclusion
  // Edge avoidance scales with cluster size - busier clusters push harder
  const resolveCollisions = useCallback((
    allItems: PositionedItem[], 
    anchors: Map<string, Position>,
    anchorExclusionRadius: number,
    clusterSizes: Map<string, number> // How many books per genre
  ): PositionedItem[] => {
    if (allItems.length <= 1) return allItems;
    
    const resolved = allItems.map(item => ({ 
      ...item, 
      position: { ...item.position } 
    }));
    
    // Mobile: fewer iterations, let positions "breathe" more naturally
    // Desktop: more iterations for tighter packing
    const iterations = isMobile ? 25 : 80;
    const basePushStrength = isMobile ? 2 : 2;
    
    // Edge pushback - minimal on mobile to preserve organic scatter
    const hardEdgeMargin = 2;
    const softEdgeZone = isMobile ? 0 : 5; // NO soft zone on mobile - just hard boundary
    
    // Get max cluster size for scaling
    const maxClusterSize = Math.max(1, ...Array.from(clusterSizes.values()));
    
    for (let iter = 0; iter < iterations; iter++) {
      let hasCollision = false;
      
      // MOBILE: Skip edge avoidance entirely - let items float freely
      // Only apply edge logic on desktop/tablet
      if (!isMobile) {
        for (const item of resolved) {
          const clusterSize = clusterSizes.get(item.genre || '') || 1;
          const clusterMultiplier = 1 + ((clusterSize / maxClusterSize) * 0.3);
          
          const halfW = item.size.w / 2;
          const halfH = item.size.h / 2;
          
          const leftEdgeDist = item.position.x - halfW;
          const rightEdgeDist = 100 - item.position.x - halfW;
          const topEdgeDist = item.position.y - halfH;
          const bottomEdgeDist = 100 - item.position.y - halfH;
          
          if (leftEdgeDist < hardEdgeMargin) {
            item.position.x += (hardEdgeMargin - leftEdgeDist) * 0.8 * clusterMultiplier;
            hasCollision = true;
          }
          
          if (rightEdgeDist < hardEdgeMargin) {
            item.position.x -= (hardEdgeMargin - rightEdgeDist) * 0.8 * clusterMultiplier;
            hasCollision = true;
          }
          
          if (topEdgeDist < hardEdgeMargin) {
            item.position.y += (hardEdgeMargin - topEdgeDist) * 0.8;
            hasCollision = true;
          }
          
          if (bottomEdgeDist < hardEdgeMargin) {
            item.position.y -= (hardEdgeMargin - bottomEdgeDist) * 0.8;
            hasCollision = true;
          }
        }
      }
      
      // Second pass: Resolve item-to-item collisions
      // On mobile, only resolve within same genre (zones don't overlap)
      for (let i = 0; i < resolved.length; i++) {
        for (let j = i + 1; j < resolved.length; j++) {
          const a = resolved[i];
          const b = resolved[j];
          
          // On mobile, skip collision between different genres (they're in separate zones)
          if (isMobile && a.genre !== b.genre) continue;
          
          if (checkOverlap(a, b)) {
            hasCollision = true;
            
            let dx = b.position.x - a.position.x;
            let dy = b.position.y - a.position.y;
            
            if (dx === 0 && dy === 0) {
              dx = (Math.random() - 0.5) * 8;
              dy = (Math.random() - 0.5) * 4; // Less vertical randomness on mobile
            }
            
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Stronger push when items are very close
            const overlapFactor = 1.5 + (2 / (dist + 0.3));
            
            // BALANCED push - no horizontal preference
            // Equal horizontal and vertical push to preserve diagonal cascade pattern
            const pushX = (dx / dist) * basePushStrength * overlapFactor;
            const pushY = (dy / dist) * basePushStrength * overlapFactor;
            
            // SYMMETRIC collision resolution - equal weights for both items
            // No edge bias - let items spread naturally in both directions
            const aWeight = 0.5;
            const bWeight = 0.5;
            
            a.position.x -= pushX * aWeight;
            a.position.y -= pushY * aWeight;
            b.position.x += pushX * bWeight;
            b.position.y += pushY * bWeight;
          }
        }
      }
      
      // Third pass: Push items away from anchor (exclusion zone)
      // SKIP on mobile - let books overlap the star if needed
      if (!isMobile) {
        for (const item of resolved) {
          const anchor = item.genre ? anchors.get(item.genre) : null;
          if (anchor) {
            const dxToAnchor = item.position.x - anchor.x;
            const dyToAnchor = item.position.y - anchor.y;
            const distToAnchor = Math.sqrt(dxToAnchor * dxToAnchor + dyToAnchor * dyToAnchor);
            
            if (distToAnchor < anchorExclusionRadius && distToAnchor > 0.1) {
              const pushAway = (anchorExclusionRadius - distToAnchor) * 0.6;
              item.position.x += (dxToAnchor / distToAnchor) * pushAway;
              item.position.y += (dyToAnchor / distToAnchor) * pushAway;
            }
          }
        }
      }
      
      // Final clamp - ONLY prevent going off-screen, no extra margins on mobile
      for (const item of resolved) {
        if (isMobile) {
          // Minimal clamp - just prevent clipping
          item.position.x = clamp(item.position.x, item.size.w / 2, 100 - item.size.w / 2);
          if (item.zoneBounds) {
            item.position.y = clamp(
              item.position.y, 
              item.zoneBounds.yMin + item.size.h / 2, 
              item.zoneBounds.yMax - item.size.h / 2
            );
          }
        } else {
          item.position.x = clamp(item.position.x, item.size.w / 2 + 2, 100 - item.size.w / 2 - 2);
          item.position.y = clamp(item.position.y, item.size.h / 2 + 1, 100 - item.size.h / 2 - 1);
        }
      }
      
      // Early exit if well-separated
      if (!hasCollision && iter > 10) break;
    }
    
    return resolved;
  }, [checkOverlap, isMobile]);

  const positionedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const itemIds = items.map(item => item.id);
    const itemIdsSet = new Set(itemIds);
    
    const prevIds = positionedIdsRef.current;
    const hasNewItems = itemIds.some(id => !prevIds.has(id));
    const hasRemovedItems = [...prevIds].some(id => !itemIdsSet.has(id));
    
    if (!hasNewItems && !hasRemovedItems && positions.size > 0) {
      return;
    }

    // STEP 1: Establish fixed anchor positions for each genre (constellation labels)
    // These are the authoritative positions - books will cluster around them
    const anchors = new Map<string, Position>();
    
    // Use popularity-sorted genres (most books → zone 0 at top)
    sortedGenresByPopularity.forEach((genre, idx) => {
      // Assign zones in order: most popular genre gets zone 0 (top)
      // NEVER fall back to the last zone (that concentrates genres on one side).
      const zone = zones[idx % zones.length];
      
      // Anchor at center of its zone
      anchors.set(genre, {
        x: zone.xCenter,
        y: zone.yCenter
      });
    });

    // STEP 2: Position books around their genre's anchor (not on top of it)
    // ADAPTIVE RADIUS: Base radius is scaled up inside positionItemsAroundAnchor based on item count
    let allPositioned: PositionedItem[] = [];
    const baseClusterRadius = isMobile ? 12 : 18; // Base radius - will be scaled by genre size
    const anchorExclusionRadius = isMobile ? 4 : 6; // Keep books away from star/label
    
    sortedGenresByPopularity.forEach((genre, idx) => {
      const groupItems = genreGroups[genre];
      const anchor = anchors.get(genre);
      if (!anchor || !groupItems) return;
      
      // Get zone for this genre's strict bounds
      const zone = zones[idx % zones.length];
      const zoneBounds = isMobile ? { yMin: zone.yMin, yMax: zone.yMax } : undefined;
      
      // Pass base radius - adaptive scaling happens inside positionItemsAroundAnchor
      const positioned = positionItemsAroundAnchor(groupItems, anchor, baseClusterRadius, anchorExclusionRadius, zoneBounds);
      allPositioned = [...allPositioned, ...positioned];
    });

    // STEP 3: Build cluster size map for edge avoidance scaling
    const clusterSizes = new Map<string, number>();
    Object.entries(genreGroups).forEach(([genre, groupItems]) => {
      clusterSizes.set(genre, groupItems.length);
    });
    
    // STEP 4: Resolve collisions with anchor exclusion and cluster-based edge avoidance
    const resolved = resolveCollisions(allPositioned, anchors, anchorExclusionRadius, clusterSizes);

    const newPositions = new Map<string, Position>();
    resolved.forEach(item => {
      newPositions.set(item.id, item.position);
    });
    
    positionedIdsRef.current = itemIdsSet;
    setPositions(newPositions);
    setGenreAnchors(anchors); // Use the fixed anchors, not recalculated ones
  }, [items, genreGroups, genreZoneAssignments, zones, positionItemsAroundAnchor, resolveCollisions, isMobile, positions.size]);

  // Cohesion force: gradually pull scattered books back toward their cluster centers
  const applyCohesionForce = useCallback(() => {
    if (positions.size === 0 || genreAnchors.size === 0) return;
    
    const cohesionStrength = 0.08; // Gentle pull (8% of distance per tick)
    const maxDrift = isMobile ? 25 : 20; // Only apply if book has drifted beyond this distance
    const bookOffsetY = isMobile ? 5 : 6;
    
    const newPositions = new Map<string, Position>();
    let hasChanges = false;
    
    items.forEach(item => {
      const currentPos = positions.get(item.id);
      if (!currentPos || !item.genre) {
        if (currentPos) newPositions.set(item.id, currentPos);
        return;
      }
      
      const anchor = genreAnchors.get(item.genre);
      if (!anchor) {
        newPositions.set(item.id, currentPos);
        return;
      }
      
      // Book cluster center is offset below anchor
      const clusterCenter = {
        x: anchor.x,
        y: Math.min(92, anchor.y + bookOffsetY)
      };
      
      const dx = currentPos.x - clusterCenter.x;
      const dy = currentPos.y - clusterCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only apply cohesion if book has drifted beyond threshold
      if (distance > maxDrift) {
        hasChanges = true;
        const pullX = dx * cohesionStrength;
        const pullY = dy * cohesionStrength;
        
        newPositions.set(item.id, {
          x: clamp(currentPos.x - pullX, 10, 90),
          y: clamp(currentPos.y - pullY, 8, 92)
        });
      } else {
        newPositions.set(item.id, currentPos);
      }
    });
    
    if (hasChanges) {
      setPositions(newPositions);
    }
  }, [items, positions, genreAnchors, isMobile]);

  // Cohesion force disabled for now - was causing layout complications
  // Keep the useEffect structure to maintain consistent hook count
  useEffect(() => {
    // Disabled: cohesion force was causing layout issues
    // const interval = setInterval(() => {
    //   applyCohesionForce();
    // }, 3000);
    // return () => clearInterval(interval);
  }, [applyCohesionForce]);

  // Build zone bounds map for external use (using popularity-sorted genres)
  const genreZoneBounds = useMemo(() => {
    const bounds = new Map<string, { yMin: number; yMax: number }>();
    if (isMobile) {
      sortedGenresByPopularity.forEach((genre, idx) => {
        const zone = zones[idx] as MobileZone;
        if (zone) {
          bounds.set(genre, { yMin: zone.yMin, yMax: zone.yMax });
        }
      });
    }
    return bounds;
  }, [sortedGenresByPopularity, zones, isMobile]);

  // Calculate dynamic tilts based on neighboring positions to avoid overlaps
  // Items tilt away from their closest neighbor in the same genre
  const itemTilts = useMemo(() => {
    const tilts = new Map<string, number>();
    
    // Group positions by genre for neighbor detection
    const positionsByGenre = new Map<string, { id: string; pos: Position }[]>();
    items.forEach(item => {
      const pos = positions.get(item.id);
      if (!pos) return;
      
      const genre = item.genre || 'Uncategorized';
      if (!positionsByGenre.has(genre)) {
        positionsByGenre.set(genre, []);
      }
      positionsByGenre.get(genre)!.push({ id: item.id, pos });
    });
    
    // For each item, calculate tilt based on closest neighbor
    items.forEach(item => {
      const pos = positions.get(item.id);
      if (!pos) {
        tilts.set(item.id, 0);
        return;
      }
      
      const genre = item.genre || 'Uncategorized';
      const genreItems = positionsByGenre.get(genre) || [];
      
      // Find closest neighbor
      let closestDist = Infinity;
      let closestDx = 0;
      let closestDy = 0;
      
      genreItems.forEach(other => {
        if (other.id === item.id) return;
        
        const dx = other.pos.x - pos.x;
        const dy = other.pos.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < closestDist) {
          closestDist = dist;
          closestDx = dx;
          closestDy = dy;
        }
      });
      
      // Calculate tilt: tilt away from closest neighbor
      // Max tilt of ±12 degrees, stronger when items are closer
      if (closestDist < 25 && closestDist > 0.1) {
        // Tilt perpendicular to the direction of closest neighbor
        // If neighbor is to the right, tilt clockwise (positive)
        // If neighbor is to the left, tilt counter-clockwise (negative)
        const proximityFactor = 1 - (closestDist / 25); // 1 when very close, 0 when far
        const maxTilt = 12;
        
        // Determine tilt direction based on relative position
        // Horizontal neighbors cause vertical tilting, vertical neighbors cause horizontal tilting
        const tiltAngle = closestDx > 0 
          ? maxTilt * proximityFactor 
          : -maxTilt * proximityFactor;
        
        // Add vertical influence - items above tilt one way, below tilt other
        const verticalInfluence = closestDy > 0 ? 2 : -2;
        
        tilts.set(item.id, clamp(tiltAngle + verticalInfluence * proximityFactor, -15, 15));
      } else {
        // No close neighbors - apply subtle deterministic rotation based on ID
        const hash = item.id.split('').reduce((a, b) => ((a << 3) - a) + b.charCodeAt(0), 0);
        const subtleTilt = ((hash % 10) - 5) * 0.8; // ±4 degrees
        tilts.set(item.id, subtleTilt);
      }
    });
    
    return tilts;
  }, [items, positions]);

  return { positions, genreAnchors, genreZoneBounds, genreCount: numGenres, applyCohesionForce, itemTilts };
}
