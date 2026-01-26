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
  // Upper band (visible in first viewport) - left side
  { xCenter: 10, yCenter: 25, radius: 7 },   // Top-left
  { xCenter: 10, yCenter: 50, radius: 7 },   // Mid-left  
  { xCenter: 10, yCenter: 75, radius: 7 },   // Lower-left
  // Upper band - right side
  { xCenter: 90, yCenter: 25, radius: 7 },   // Top-right
  { xCenter: 90, yCenter: 50, radius: 7 },   // Mid-right
  { xCenter: 90, yCenter: 75, radius: 7 },   // Lower-right
  // Additional zones closer to center if needed (staggered)
  { xCenter: 18, yCenter: 35, radius: 6 },   // Inner-left upper
  { xCenter: 18, yCenter: 65, radius: 6 },   // Inner-left lower
  { xCenter: 82, yCenter: 35, radius: 6 },   // Inner-right upper
  { xCenter: 82, yCenter: 65, radius: 6 },   // Inner-right lower
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

const generateMobileZones = (startYPercent: number, numGenres: number): MobileZone[] => {
  // Each genre gets a fixed-height band - compact but readable
  // The container height is calculated based on numGenres, so 100% is divided evenly
  const bandHeight = 100 / Math.max(1, numGenres); // Equal distribution
  const zones: MobileZone[] = [];
  
  for (let i = 0; i < Math.max(12, numGenres); i++) {
    const yMin = i * bandHeight;
    const yMax = (i + 1) * bandHeight;
    const yCenter = yMin + 8; // Anchor near top of band (8% into band)
    
    zones.push({
      xCenter: 50,
      yCenter: Math.min(yCenter, 95), // Never go past 95%
      yMin: yMin + 2, // 2% padding at top
      yMax: Math.min(yMax - 2, 96), // 2% padding at bottom, never past 96%
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
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
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

  const numGenres = Object.keys(genreGroups).length;
  
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

  // Position items around their genre's anchor point (but not ON the anchor)
  // On mobile, strictly enforce vertical zone bounds
  const positionItemsAroundAnchor = useCallback((
    zoneItems: CloudItem[],
    anchor: { x: number; y: number },
    maxRadius: number,
    anchorExclusionRadius: number, // Keep items away from anchor center
    zoneBounds?: { yMin: number; yMax: number } // Mobile only - strict vertical limits
  ): PositionedItem[] => {
    const positioned: PositionedItem[] = [];
    
    // Safe margins - generous but not excessive
    const safeMarginX = isMobile ? 18 : 8;
    const safeMarginY = isMobile ? 2 : 4;
    
    zoneItems.forEach((item, idx) => {
      const displayText = item.enriched_answer || item.answer;
      const size = estimateItemSize(displayText, isMobile);
      
      if (isMobile && zoneBounds) {
        // MOBILE: Stack books vertically below anchor, one per row
        // This prevents horizontal overlap entirely
        const rowSpacing = size.h + 1.5; // 1% vh minimum gap between rows
        const startY = anchor.y + anchorExclusionRadius + 4;
        let y = startY + (idx * rowSpacing);
        
        // Center all books horizontally
        let x = 50;
        
        // Strict clamp to zone bounds - items MUST stay in their zone
        const minY = zoneBounds.yMin + size.h / 2 + 1;
        const maxY = zoneBounds.yMax - size.h / 2 - 1;
        y = clamp(y, Math.max(minY, anchor.y + anchorExclusionRadius + 1), maxY);
        x = clamp(x, size.w / 2 + safeMarginX, 100 - size.w / 2 - safeMarginX);
        
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
        // DESKTOP: Ring layout around anchor
        const angle = (idx * 137.5 * Math.PI) / 180; // Golden angle
        const minDistance = anchorExclusionRadius + 2;
        const distance = Math.min(maxRadius, minDistance + idx * 2);
        
        let pos: Position = {
          x: anchor.x + Math.cos(angle) * distance,
          y: anchor.y + Math.sin(angle) * distance * 0.8
        };
        
        pos.x = clamp(pos.x, size.w / 2 + safeMarginX, 100 - size.w / 2 - safeMarginX);
        pos.y = clamp(pos.y, size.h / 2 + safeMarginY, 100 - size.h / 2 - safeMarginY);
        
        positioned.push({
          id: item.id,
          genre: item.genre,
          position: pos,
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
    
    const iterations = 150; // More iterations for thorough separation
    const basePushStrength = isMobile ? 5 : 3; // Increased base push
    const safeMarginX = isMobile ? 20 : 10; // Stronger edge margins
    const safeMarginY = isMobile ? 8 : 5;
    const edgeZone = isMobile ? 30 : 22; // Wider edge zone
    
    // Get max cluster size for scaling
    const maxClusterSize = Math.max(1, ...Array.from(clusterSizes.values()));
    
    for (let iter = 0; iter < iterations; iter++) {
      let hasCollision = false;
      
      // First pass: Push items away from edges - strength scales with cluster size
      for (const item of resolved) {
        const clusterSize = clusterSizes.get(item.genre || '') || 1;
        // Busier clusters push harder (1.0 to 2.5x multiplier)
        const clusterMultiplier = 1 + ((clusterSize / maxClusterSize) * 1.5);
        
        const leftEdgeDist = item.position.x - safeMarginX;
        const rightEdgeDist = (100 - safeMarginX) - item.position.x;
        
        // If too close to left edge, push right
        if (leftEdgeDist < edgeZone && item.position.x < 50) {
          const pushStrength = ((edgeZone - leftEdgeDist) / edgeZone) * 3 * clusterMultiplier;
          item.position.x += pushStrength;
          hasCollision = true;
        }
        
        // If too close to right edge, push left
        if (rightEdgeDist < edgeZone && item.position.x > 50) {
          const pushStrength = ((edgeZone - rightEdgeDist) / edgeZone) * 3 * clusterMultiplier;
          item.position.x -= pushStrength;
          hasCollision = true;
        }
        
        // Also check top/bottom edges
        const topEdgeDist = item.position.y - safeMarginY;
        const bottomEdgeDist = (100 - safeMarginY) - item.position.y;
        
        if (topEdgeDist < edgeZone * 0.5) {
          const pushStrength = ((edgeZone * 0.5 - topEdgeDist) / (edgeZone * 0.5)) * 2;
          item.position.y += pushStrength;
          hasCollision = true;
        }
        
        if (bottomEdgeDist < edgeZone * 0.5) {
          const pushStrength = ((edgeZone * 0.5 - bottomEdgeDist) / (edgeZone * 0.5)) * 2;
          item.position.y -= pushStrength;
          hasCollision = true;
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
            
            // Check if pushing toward edge - if so, push the other item more
            const aAtLeftEdge = a.position.x < edgeZone;
            const aAtRightEdge = a.position.x > (100 - edgeZone);
            const bAtLeftEdge = b.position.x < edgeZone;
            const bAtRightEdge = b.position.x > (100 - edgeZone);
            
            // Bias push away from edges - items near edges move less, others move more
            let aWeight = 0.5;
            let bWeight = 0.5;
            
            if (aAtLeftEdge || aAtRightEdge) { aWeight = 0.1; bWeight = 0.9; }
            if (bAtLeftEdge || bAtRightEdge) { aWeight = 0.9; bWeight = 0.1; }
            
            a.position.x -= pushX * aWeight;
            a.position.y -= pushY * aWeight;
            b.position.x += pushX * bWeight;
            b.position.y += pushY * bWeight;
          }
        }
      }
      
      // Third pass: Push items away from their anchor (exclusion zone around star/label)
      // And enforce strict zone bounds on mobile
      for (const item of resolved) {
        const anchor = item.genre ? anchors.get(item.genre) : null;
        if (anchor) {
          const dxToAnchor = item.position.x - anchor.x;
          const dyToAnchor = item.position.y - anchor.y;
          const distToAnchor = Math.sqrt(dxToAnchor * dxToAnchor + dyToAnchor * dyToAnchor);
          
          // If too close to anchor, push away (prefer pushing down on mobile)
          if (distToAnchor < anchorExclusionRadius && distToAnchor > 0.1) {
            const pushAway = (anchorExclusionRadius - distToAnchor) * 0.6;
            item.position.x += (dxToAnchor / distToAnchor) * pushAway;
            // On mobile, always push items downward from anchor
            if (isMobile) {
              item.position.y = Math.max(item.position.y, anchor.y + anchorExclusionRadius + 1);
            } else {
              item.position.y += (dyToAnchor / distToAnchor) * pushAway;
            }
          }
        }
        
        // Final clamp - on mobile, use strict zone bounds
        item.position.x = clamp(item.position.x, item.size.w / 2 + safeMarginX, 100 - item.size.w / 2 - safeMarginX);
        
        if (isMobile && item.zoneBounds) {
          // Strict zone bounds on mobile - NEVER cross into another constellation
          const anchor = item.genre ? anchors.get(item.genre) : null;
          const minY = anchor ? anchor.y + anchorExclusionRadius + 1 : item.zoneBounds.yMin + item.size.h / 2;
          item.position.y = clamp(item.position.y, minY, item.zoneBounds.yMax - item.size.h / 2 - 1);
        } else {
          item.position.y = clamp(item.position.y, item.size.h / 2 + safeMarginY, 100 - item.size.h / 2 - safeMarginY);
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
    
    // Sort genres for consistent ordering
    const sortedGenres = Object.keys(genreGroups).sort();
    
    sortedGenres.forEach((genre, idx) => {
      // Assign zones in order to match sorted genres
      const zone = zones[idx] || zones[zones.length - 1];
      
      // Anchor is near top of its zone - this is where the constellation label appears
      anchors.set(genre, {
        x: zone.xCenter,
        y: zone.yCenter
      });
    });

    // STEP 2: Position books around their genre's anchor (not on top of it)
    // On mobile, pass strict zone bounds to prevent cross-constellation overlap
    let allPositioned: PositionedItem[] = [];
    const bookClusterRadius = isMobile ? 10 : 15;
    const anchorExclusionRadius = isMobile ? 3 : 5; // Keep books away from star/label
    
    sortedGenres.forEach((genre, idx) => {
      const groupItems = genreGroups[genre];
      const anchor = anchors.get(genre);
      if (!anchor || !groupItems) return;
      
      // Get zone for this genre's strict bounds
      const zone = zones[idx] || zones[zones.length - 1];
      const zoneBounds = isMobile ? { yMin: zone.yMin, yMax: zone.yMax } : undefined;
      
      const positioned = positionItemsAroundAnchor(groupItems, anchor, bookClusterRadius, anchorExclusionRadius, zoneBounds);
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

  // Build zone bounds map for external use
  const genreZoneBounds = useMemo(() => {
    const bounds = new Map<string, { yMin: number; yMax: number }>();
    if (isMobile) {
      const sortedGenres = Object.keys(genreGroups).sort();
      sortedGenres.forEach((genre, idx) => {
        const zone = zones[idx] as MobileZone;
        if (zone) {
          bounds.set(genre, { yMin: zone.yMin, yMax: zone.yMax });
        }
      });
    }
    return bounds;
  }, [genreGroups, zones, isMobile]);

  return { positions, genreAnchors, genreZoneBounds, applyCohesionForce };
}
