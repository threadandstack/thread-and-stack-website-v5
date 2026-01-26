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

// Desktop uses golden angle spiral - creates nice organic distribution
const CLOCK_POSITIONS_DESKTOP = [
  180, 0, 90, 270, 60, 330, 210, 150, 30, 300, 240, 120,
  15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345,
];

const generateMobileZones = (startYPercent: number, numGenres: number): MobileZone[] => {
  // IMPORTANT: Positions are % within the cloud container (0–100).
  // Zone bounds MUST stay within 0–100. We create *physical* room by increasing
  // the container height (vh/px), not by letting yMin/yMax exceed 100.
  const zoneCount = Math.max(1, numGenres);
  const bandHeight = 100 / zoneCount;
  const zones: MobileZone[] = [];

  for (let i = 0; i < zoneCount; i++) {
    const yMinRaw = i * bandHeight;
    const yMaxRaw = (i + 1) * bandHeight;

    // MINIMAL padding - let books use nearly the full zone height
    // Only 1% padding to prevent items from literally touching zone edges
    const padding = 1;
    const yMin = clamp(yMinRaw + padding, 0, 100);
    const yMax = clamp(yMaxRaw - padding, 0, 100);

    // Position anchor in the CENTER of the zone for true circular distribution
    // Books will be placed evenly around this point
    const yCenter = clamp(yMinRaw + bandHeight * 0.5, 2, 98);

    zones.push({
      xCenter: 50,
      yCenter,
      yMin,
      yMax: Math.max(yMax, yMin + 2),
      radius: 6,
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
  
  const zones = useMemo(() => 
    isMobile ? generateMobileZones(mobileStartY, numGenres) : GENRE_ZONES_DESKTOP.map(z => ({ ...z, yMin: 0, yMax: 100 })), 
    [isMobile, mobileStartY, numGenres]
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

  // ==========================================================================
  // TRUE DETERMINISTIC CLOCK-FACE DISTRIBUTION
  // ==========================================================================
  // Books are placed on CONCENTRIC RINGS around the star anchor.
  // Each ring has a fixed number of angular slots (evenly spaced).
  // We fill inner rings first, then expand outward.
  // This guarantees:
  //   1. Even angular distribution (no clustering)
  //   2. Predictable, deterministic placement
  //   3. Optimal use of available space
  // ==========================================================================
  const positionItemsAroundAnchor = useCallback((
    zoneItems: CloudItem[],
    anchor: { x: number; y: number },
    baseMaxRadius: number,
    anchorExclusionRadius: number,
    zoneBounds?: { yMin: number; yMax: number }
  ): PositionedItem[] => {
    const positioned: PositionedItem[] = [];
    const itemCount = zoneItems.length;
    
    if (itemCount === 0) return positioned;
    
    // ========== RING CONFIGURATION ==========
    // Define how many slots each ring has and at what distance
    // Inner rings have fewer slots, outer rings have more
    // This creates natural spacing that expands as we go outward
    
    interface RingConfig {
      slotCount: number;      // Number of angular positions on this ring
      radiusFraction: number; // 0-1, fraction of max radius
    }
    
    // Ring definitions - designed to fill uniformly
    // Ring 1 (closest): 4 slots at cardinal directions
    // Ring 2: 6 slots for slightly more coverage  
    // Ring 3: 8 slots (all cardinal + diagonal)
    // Ring 4+: 10-12 slots for dense genres
    const RING_CONFIGS: RingConfig[] = [
      { slotCount: 4, radiusFraction: 0.30 },   // Ring 1: N, E, S, W
      { slotCount: 6, radiusFraction: 0.50 },   // Ring 2: 60° apart
      { slotCount: 8, radiusFraction: 0.70 },   // Ring 3: 45° apart
      { slotCount: 10, radiusFraction: 0.85 },  // Ring 4: 36° apart
      { slotCount: 12, radiusFraction: 1.00 },  // Ring 5: 30° apart (max spread)
    ];
    
    // Calculate total capacity of all rings
    const getTotalCapacity = (ringCount: number): number => {
      let total = 0;
      for (let i = 0; i < ringCount && i < RING_CONFIGS.length; i++) {
        total += RING_CONFIGS[i].slotCount;
      }
      return total;
    };
    
    // Determine how many rings we need
    let ringsNeeded = 1;
    while (getTotalCapacity(ringsNeeded) < itemCount && ringsNeeded < RING_CONFIGS.length) {
      ringsNeeded++;
    }
    
    // If we have MORE items than ring capacity, we'll need to double-up on outer rings
    const totalCapacity = getTotalCapacity(ringsNeeded);
    const needsOverflow = itemCount > totalCapacity;
    
    // ========== RADIUS SCALING ==========
    // Larger genres need more space - scale the base radius
    let radiusScale: number;
    if (itemCount <= 3) {
      radiusScale = 0.9;
    } else if (itemCount <= 6) {
      radiusScale = 1.0;
    } else if (itemCount <= 10) {
      radiusScale = 1.2;
    } else if (itemCount <= 15) {
      radiusScale = 1.5;
    } else if (itemCount <= 20) {
      radiusScale = 1.8;
    } else {
      radiusScale = 2.0 + (itemCount - 20) * 0.05; // Keep scaling for huge genres
    }
    
    // ========== SLOT ASSIGNMENT ==========
    // Assign each item to a specific ring and angular slot
    // We fill rings from inside out, and within each ring, distribute evenly
    
    interface SlotAssignment {
      ringIndex: number;
      slotIndex: number;
      angle: number;       // Degrees, 0 = 12 o'clock
      radiusFraction: number;
    }
    
    const assignments: SlotAssignment[] = [];
    let itemIndex = 0;
    
    // First pass: fill rings normally
    for (let ringIdx = 0; ringIdx < ringsNeeded && itemIndex < itemCount; ringIdx++) {
      const ring = RING_CONFIGS[ringIdx];
      const slotsToFill = Math.min(ring.slotCount, itemCount - itemIndex);
      
      // Offset angle for this ring to stagger between rings
      // Ring 0: starts at 0° (12 o'clock)
      // Ring 1: starts at 30° offset
      // Ring 2: starts at 22.5° offset, etc.
      const ringOffset = ringIdx * 22.5;
      
      for (let slotIdx = 0; slotIdx < slotsToFill; slotIdx++) {
        const anglePerSlot = 360 / ring.slotCount;
        const angle = ringOffset + (slotIdx * anglePerSlot);
        
        assignments.push({
          ringIndex: ringIdx,
          slotIndex: slotIdx,
          angle: angle % 360,
          radiusFraction: ring.radiusFraction
        });
        itemIndex++;
      }
    }
    
    // Overflow handling: if we have more items than slots, add them to outer rings
    // with interpolated angles between existing slots
    if (needsOverflow && itemIndex < itemCount) {
      const outerRing = RING_CONFIGS[RING_CONFIGS.length - 1];
      const remaining = itemCount - itemIndex;
      
      // Create additional slots at slightly larger radius
      for (let i = 0; i < remaining; i++) {
        const overflowAngle = (i * 360 / remaining) + 15; // 15° offset from main grid
        assignments.push({
          ringIndex: RING_CONFIGS.length, // Overflow ring
          slotIndex: i,
          angle: overflowAngle % 360,
          radiusFraction: 1.15 // Beyond the normal max
        });
      }
    }
    
    // ========== POSITION CALCULATION ==========
    const safeMarginX = 1;
    const safeMarginY = isMobile ? 1 : 2;
    
    zoneItems.forEach((item, idx) => {
      const displayText = item.enriched_answer || item.answer;
      const size = estimateItemSize(displayText, isMobile);
      const assignment = assignments[idx];
      
      if (!assignment) {
        // Fallback - shouldn't happen but safety first
        positioned.push({
          id: item.id,
          genre: item.genre,
          position: { x: anchor.x, y: anchor.y + 5 },
          size,
          anchorX: anchor.x,
          anchorY: anchor.y,
          zoneBounds
        });
        return;
      }
      
      // Convert angle to radians (0° = up/north, clockwise positive)
      const angleRad = (assignment.angle * Math.PI) / 180;
      
      if (isMobile && zoneBounds) {
        // ========== MOBILE POSITIONING ==========
        const zoneHeight = zoneBounds.yMax - zoneBounds.yMin;
        
        // Calculate available space from anchor to zone edges
        const roomAbove = anchor.y - zoneBounds.yMin;
        const roomBelow = zoneBounds.yMax - anchor.y;
        const roomLeft = anchor.x - safeMarginX;
        const roomRight = 100 - anchor.x - safeMarginX;
        
        // Max radius in each direction (use 90% of available space)
        const maxRadiusUp = roomAbove * 0.90;
        const maxRadiusDown = roomBelow * 0.90;
        const maxRadiusLeft = roomLeft * 0.90;
        const maxRadiusRight = roomRight * 0.90;
        
        // Apply radius scaling and assignment fraction
        const effectiveRadiusFraction = assignment.radiusFraction * radiusScale;
        
        // Calculate the unit vector for this angle
        const sinA = Math.sin(angleRad);
        const cosA = Math.cos(angleRad);
        
        // Determine max radius based on direction
        // Top-right quadrant: use maxRadiusUp and maxRadiusRight
        // etc.
        let maxRadiusX: number, maxRadiusY: number;
        
        if (sinA >= 0) {
          // Going right
          maxRadiusX = maxRadiusRight;
        } else {
          // Going left
          maxRadiusX = maxRadiusLeft;
        }
        
        if (cosA >= 0) {
          // Going up (negative Y in screen coords)
          maxRadiusY = maxRadiusUp;
        } else {
          // Going down (positive Y in screen coords)
          maxRadiusY = maxRadiusDown;
        }
        
        // Calculate actual radius (clamped)
        const radiusX = clamp(maxRadiusX * effectiveRadiusFraction, 6, 45);
        const radiusY = clamp(maxRadiusY * effectiveRadiusFraction, 4, Math.min(35, zoneHeight * 0.45));
        
        // Calculate position (0° = up = negative Y)
        let x = anchor.x + sinA * radiusX;
        let y = anchor.y - cosA * radiusY;
        
        // Final clamp to hard boundaries
        x = clamp(x, size.w / 2 + safeMarginX, 100 - size.w / 2 - safeMarginX);
        y = clamp(y, zoneBounds.yMin + size.h / 2 + 0.5, zoneBounds.yMax - size.h / 2 - 0.5);
        
        positioned.push({
          id: item.id,
          genre: item.genre,
          position: { x, y },
          size,
          anchorX: anchor.x,
          anchorY: anchor.y,
          zoneBounds
        });
        
      } else {
        // ========== DESKTOP POSITIONING ==========
        // Desktop has more room - use full circular distribution
        
        const adaptiveMaxRadius = baseMaxRadius * radiusScale;
        const minDistance = anchorExclusionRadius + 2;
        const maxDistance = adaptiveMaxRadius;
        
        // Calculate actual distance for this ring
        const distance = minDistance + (maxDistance - minDistance) * assignment.radiusFraction;
        
        // Desktop uses standard trig (cos for X, sin for Y)
        // But we want 0° to be "up", so we rotate 90°
        let x = anchor.x + Math.sin(angleRad) * distance;
        let y = anchor.y - Math.cos(angleRad) * distance * 0.8; // Slightly compress Y
        
        // Clamp to screen
        x = clamp(x, size.w / 2 + safeMarginX, 100 - size.w / 2 - safeMarginX);
        y = clamp(y, size.h / 2 + safeMarginY, 100 - size.h / 2 - safeMarginY);
        
        positioned.push({
          id: item.id,
          genre: item.genre,
          position: { x, y },
          size,
          anchorX: anchor.x,
          anchorY: anchor.y
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
    
    const iterations = 100;
    const basePushStrength = isMobile ? 3 : 2;
    
    // CRITICAL: Edge pushback should ONLY happen at TRUE viewport boundaries
    // Within zones, items should use the FULL available space
    // On mobile: zone bounds already handle vertical limits - no extra top/bottom push needed
    // Only push back if item would literally go off-screen (< 2% from edge)
    const hardEdgeMargin = 2; // Absolute minimum - only prevents going off-screen
    const softEdgeZone = isMobile ? 6 : 5; // Very small soft zone for gentle nudging
    
    // Get max cluster size for scaling
    const maxClusterSize = Math.max(1, ...Array.from(clusterSizes.values()));
    
    for (let iter = 0; iter < iterations; iter++) {
      let hasCollision = false;
      
      // First pass: Edge avoidance ONLY at true screen boundaries
      // Items within their zones should NOT be pushed away from zone edges
      for (const item of resolved) {
        const clusterSize = clusterSizes.get(item.genre || '') || 1;
        const clusterMultiplier = 1 + ((clusterSize / maxClusterSize) * 0.3);
        
        const halfW = item.size.w / 2;
        const halfH = item.size.h / 2;
        
        // Only push from TRUE screen edges - items need room for their own width/height
        const leftEdgeDist = item.position.x - halfW;
        const rightEdgeDist = 100 - item.position.x - halfW;
        const topEdgeDist = item.position.y - halfH;
        const bottomEdgeDist = 100 - item.position.y - halfH;
        
        // Push from left screen edge only if crossing boundary
        if (leftEdgeDist < hardEdgeMargin) {
          const pushStrength = (hardEdgeMargin - leftEdgeDist) * 0.8 * clusterMultiplier;
          item.position.x += pushStrength;
          hasCollision = true;
        } else if (leftEdgeDist < softEdgeZone) {
          // Very gentle nudge in soft zone
          const pushStrength = ((softEdgeZone - leftEdgeDist) / softEdgeZone) * 0.3 * clusterMultiplier;
          item.position.x += pushStrength;
        }
        
        // Push from right screen edge
        if (rightEdgeDist < hardEdgeMargin) {
          const pushStrength = (hardEdgeMargin - rightEdgeDist) * 0.8 * clusterMultiplier;
          item.position.x -= pushStrength;
          hasCollision = true;
        } else if (rightEdgeDist < softEdgeZone) {
          const pushStrength = ((softEdgeZone - rightEdgeDist) / softEdgeZone) * 0.3 * clusterMultiplier;
          item.position.x -= pushStrength;
        }
        
        // For vertical edges: on mobile, zone bounds handle this - skip extra push
        // Only apply at TRUE screen boundaries (0% and 100%)
        if (!isMobile || !item.zoneBounds) {
          if (topEdgeDist < hardEdgeMargin) {
            const pushStrength = (hardEdgeMargin - topEdgeDist) * 0.8;
            item.position.y += pushStrength;
            hasCollision = true;
          }
          
          if (bottomEdgeDist < hardEdgeMargin) {
            const pushStrength = (hardEdgeMargin - bottomEdgeDist) * 0.8;
            item.position.y -= pushStrength;
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
            const pushX = (dx / dist) * basePushStrength * overlapFactor;
            // On mobile, prefer horizontal push to stay within zone bounds
            const pushY = isMobile ? (dy / dist) * basePushStrength * overlapFactor * 0.3 : (dy / dist) * basePushStrength * overlapFactor;
            
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
      
      // Third pass: Push items away from their anchor (exclusion zone around star/label)
      // PRESERVE circular distribution - push radially outward, not just downward
      for (const item of resolved) {
        const anchor = item.genre ? anchors.get(item.genre) : null;
        if (anchor) {
          const dxToAnchor = item.position.x - anchor.x;
          const dyToAnchor = item.position.y - anchor.y;
          const distToAnchor = Math.sqrt(dxToAnchor * dxToAnchor + dyToAnchor * dyToAnchor);
          
          // If too close to anchor, push RADIALLY away (preserve circle shape)
          if (distToAnchor < anchorExclusionRadius && distToAnchor > 0.1) {
            const pushAway = (anchorExclusionRadius - distToAnchor) * 0.6;
            // Push in the same direction the item is from anchor (radial push)
            item.position.x += (dxToAnchor / distToAnchor) * pushAway;
            item.position.y += (dyToAnchor / distToAnchor) * pushAway;
          }
        }
        
        // Final clamp - use minimal margins, just prevent going off-screen
        const finalMarginX = 2;
        const finalMarginY = 1;
        item.position.x = clamp(item.position.x, item.size.w / 2 + finalMarginX, 100 - item.size.w / 2 - finalMarginX);
        
        if (isMobile && item.zoneBounds) {
          // Zone bounds - allow items above AND below anchor for circular layout
          // Use minimal padding - let items use full zone space
          item.position.y = clamp(
            item.position.y, 
            item.zoneBounds.yMin + item.size.h / 2 + 0.5, 
            item.zoneBounds.yMax - item.size.h / 2 - 0.5
          );
        } else {
          item.position.y = clamp(item.position.y, item.size.h / 2 + finalMarginY, 100 - item.size.h / 2 - finalMarginY);
        }
      }
      
      // Early exit if well-separated
      if (!hasCollision && iter > 50) break;
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

  return { positions, genreAnchors, genreZoneBounds, genreCount: numGenres, applyCohesionForce };
}
