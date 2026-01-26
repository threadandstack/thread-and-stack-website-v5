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
}

interface CloudItem {
  id: string;
  cluster_key: string | null;
  answer: string;
  enriched_answer?: string | null;
  genre: string | null;
}

interface GenreClusterResult {
  positions: Map<string, Position>;
  genreAnchors: Map<string, Position>;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// Estimate item size based on text length
const estimateItemSize = (text: string, isMobile: boolean): Size => {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const effectiveLen = clamp((text?.length ?? 0) + 6, 0, 60);
  const maxWidthPx = isMobile ? 160 : 240;
  const minWidthPx = isMobile ? 130 : 160;
  const basePx = isMobile ? 86 : 110;
  const perCharPx = isMobile ? 6.2 : 6.5;
  const widthPx = clamp(basePx + effectiveLen * perCharPx, minWidthPx, maxWidthPx);
  const heightPx = isMobile ? 44 : 40;

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

// Mobile/Tablet zones - wide horizontal bands BELOW the input area
// Start at y=38% to clear the title block and input field
// Use wide clusters spanning horizontally rather than competing vertically
const GENRE_ZONES_MOBILE: { xCenter: number; yCenter: number; radius: number }[] = [
  // Row 1 - first visible row below input (y ~38-42%)
  { xCenter: 20, yCenter: 40, radius: 12 },
  { xCenter: 50, yCenter: 42, radius: 12 },
  { xCenter: 80, yCenter: 40, radius: 12 },
  // Row 2 - second row (y ~52-56%)
  { xCenter: 15, yCenter: 54, radius: 12 },
  { xCenter: 50, yCenter: 56, radius: 12 },
  { xCenter: 85, yCenter: 54, radius: 12 },
  // Row 3 - third row (y ~66-70%)
  { xCenter: 25, yCenter: 68, radius: 12 },
  { xCenter: 75, yCenter: 70, radius: 12 },
  // Row 4 - lower area (y ~80-84%)
  { xCenter: 20, yCenter: 82, radius: 12 },
  { xCenter: 80, yCenter: 84, radius: 12 },
];

export function useGenreClusteredPositions(items: CloudItem[]): GenreClusterResult {
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

  const zones = useMemo(() => isMobile ? GENRE_ZONES_MOBILE : GENRE_ZONES_DESKTOP, [isMobile]);
  const minSpacing = isMobile ? 3 : 2;

  // Group items by genre
  const genreGroups = useMemo(() => {
    const groups: Record<string, CloudItem[]> = {};
    items.forEach(item => {
      const genre = item.genre || "Uncategorized";
      if (!groups[genre]) groups[genre] = [];
      groups[genre].push(item);
    });
    return groups;
  }, [items]);

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

  // Position items within their genre cluster zone
  const positionItemsInZone = useCallback((
    zoneItems: CloudItem[],
    zone: { xCenter: number; yCenter: number; radius: number }
  ): PositionedItem[] => {
    const positioned: PositionedItem[] = [];
    
    zoneItems.forEach((item, idx) => {
      const displayText = item.enriched_answer || item.answer;
      const size = estimateItemSize(displayText, isMobile);
      
      // Spiral placement around zone center
      const angle = (idx * 137.5 * Math.PI) / 180; // Golden angle
      const distance = Math.min(zone.radius * 0.8, 3 + idx * 2);
      
      let pos: Position = {
        x: zone.xCenter + Math.cos(angle) * distance,
        y: zone.yCenter + Math.sin(angle) * distance
      };
      
      // Clamp to valid screen area
      pos.x = clamp(pos.x, size.w / 2 + 2, 100 - size.w / 2 - 2);
      pos.y = clamp(pos.y, size.h / 2 + 2, 100 - size.h / 2 - 2);
      
      positioned.push({
        id: item.id,
        genre: item.genre,
        position: pos,
        size
      });
    });
    
    return positioned;
  }, [isMobile]);

  // Resolve collisions with iterative relaxation
  const resolveCollisions = useCallback((allItems: PositionedItem[]): PositionedItem[] => {
    if (allItems.length <= 1) return allItems;
    
    const resolved = allItems.map(item => ({ 
      ...item, 
      position: { ...item.position } 
    }));
    
    const iterations = 25;
    const pushStrength = isMobile ? 4 : 3;
    
    for (let iter = 0; iter < iterations; iter++) {
      let hasCollision = false;
      
      for (let i = 0; i < resolved.length; i++) {
        for (let j = i + 1; j < resolved.length; j++) {
          const a = resolved[i];
          const b = resolved[j];
          
          if (checkOverlap(a, b)) {
            hasCollision = true;
            
            let dx = b.position.x - a.position.x;
            let dy = b.position.y - a.position.y;
            
            if (dx === 0 && dy === 0) {
              dx = (Math.random() - 0.5) * 4;
              dy = (Math.random() - 0.5) * 4;
            }
            
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const pushX = (dx / dist) * pushStrength;
            const pushY = (dy / dist) * pushStrength;
            
            a.position.x -= pushX * 0.3;
            a.position.y -= pushY * 0.3;
            b.position.x += pushX * 0.7;
            b.position.y += pushY * 0.7;
            
            // Clamp to valid areas
            a.position.x = clamp(a.position.x, a.size.w / 2 + 2, 100 - a.size.w / 2 - 2);
            a.position.y = clamp(a.position.y, a.size.h / 2 + 2, 100 - a.size.h / 2 - 2);
            b.position.x = clamp(b.position.x, b.size.w / 2 + 2, 100 - b.size.w / 2 - 2);
            b.position.y = clamp(b.position.y, b.size.h / 2 + 2, 100 - b.size.h / 2 - 2);
          }
        }
      }
      
      if (!hasCollision) break;
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

    // Position all items by genre cluster
    let allPositioned: PositionedItem[] = [];
    const anchors = new Map<string, Position>();
    
    Object.entries(genreGroups).forEach(([genre, groupItems]) => {
      const zoneIdx = genreZoneAssignments.get(genre) || 0;
      const zone = zones[zoneIdx];
      
      // Store anchor point for constellation label (above the cluster)
      // Minimum Y of 12% ensures labels don't overlap with navigation
      const minAnchorY = isMobile ? 10 : 12;
      anchors.set(genre, {
        x: zone.xCenter,
        y: Math.max(minAnchorY, zone.yCenter - zone.radius - (isMobile ? 6 : 10))
      });
      
      const positioned = positionItemsInZone(groupItems, zone);
      allPositioned = [...allPositioned, ...positioned];
    });

    // Resolve any collisions
    const resolved = resolveCollisions(allPositioned);
    
    // Recalculate anchors based on actual book positions (centroid + offset above)
    const finalAnchors = new Map<string, Position>();
    Object.keys(genreGroups).forEach(genre => {
      const genreItems = resolved.filter(item => (item.genre || "Uncategorized") === genre);
      if (genreItems.length === 0) return;
      
      const avgX = genreItems.reduce((sum, item) => sum + item.position.x, 0) / genreItems.length;
      const minY = Math.min(...genreItems.map(item => item.position.y - item.size.h / 2));
      
      // Minimum Y of 12% ensures labels don't overlap with navigation
      const minAnchorY = isMobile ? 10 : 12;
      finalAnchors.set(genre, {
        x: avgX,
        y: Math.max(minAnchorY, minY - (isMobile ? 8 : 12))
      });
    });

    const newPositions = new Map<string, Position>();
    resolved.forEach(item => {
      newPositions.set(item.id, item.position);
    });
    
    positionedIdsRef.current = itemIdsSet;
    setPositions(newPositions);
    setGenreAnchors(finalAnchors);
  }, [items, genreGroups, genreZoneAssignments, zones, positionItemsInZone, resolveCollisions, isMobile, positions.size]);

  return { positions, genreAnchors };
}
