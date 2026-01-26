import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface Size {
  // Width/height expressed as % of the positioning container.
  // (We approximate this using viewport dimensions.)
  w: number;
  h: number;
}

interface PositionedItem {
  id: string;
  clusterKey: string;
  clusterIndex: number;
  position: Position;
  size: Size;
}

// Approximate item dimensions in percentage of container (fallbacks)
// NOTE: actual collision math uses per-item sizing derived from text length.
const ITEM_HEIGHT_DESKTOP = 4;
const ITEM_HEIGHT_MOBILE = 7;
const MIN_SPACING_DESKTOP = 2;
const MIN_SPACING_MOBILE = 3;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// Estimate each item's on-screen footprint (in %) so collision avoidance works
// even when titles are long (max-w differs across breakpoints).
const estimateItemSize = (text: string, isMobile: boolean): Size => {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // Account for emoji prefix in the rendered label (and truncation differences)
  const effectiveLen = clamp((text?.length ?? 0) + 6, 0, 60);

  // Important: on small screens our mobile zones are ~half width; keep max pill width
  // below that so items can be placed without forcing an overlap.
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

// Desktop edge zones (avoid center CTA and navigation)
const DESKTOP_ZONES = [
  // Top corners (below nav)
  { xMin: 2, xMax: 18, yMin: 14, yMax: 28 },
  { xMin: 82, xMax: 98, yMin: 14, yMax: 28 },
  // Left edge
  { xMin: 2, xMax: 16, yMin: 32, yMax: 48 },
  { xMin: 2, xMax: 16, yMin: 55, yMax: 72 },
  // Right edge
  { xMin: 84, xMax: 98, yMin: 32, yMax: 48 },
  { xMin: 84, xMax: 98, yMin: 55, yMax: 72 },
  // Bottom corners
  { xMin: 2, xMax: 20, yMin: 76, yMax: 88 },
  { xMin: 80, xMax: 98, yMin: 76, yMax: 88 },
  // Far bottom edges
  { xMin: 25, xMax: 40, yMin: 82, yMax: 92 },
  { xMin: 60, xMax: 75, yMin: 82, yMax: 92 },
];

// Mobile/Tablet zones: Non-overlapping grid below the input
// Full width rows with staggered left/right positioning
const MOBILE_ZONES = [
  // Row 1
  { xMin: 3, xMax: 45, yMin: 2, yMax: 11 },
  { xMin: 52, xMax: 97, yMin: 2, yMax: 11 },
  // Row 2
  { xMin: 3, xMax: 48, yMin: 13, yMax: 22 },
  { xMin: 50, xMax: 97, yMin: 13, yMax: 22 },
  // Row 3
  { xMin: 3, xMax: 45, yMin: 24, yMax: 33 },
  { xMin: 52, xMax: 97, yMin: 24, yMax: 33 },
  // Row 4
  { xMin: 3, xMax: 48, yMin: 35, yMax: 44 },
  { xMin: 50, xMax: 97, yMin: 35, yMax: 44 },
  // Row 5
  { xMin: 3, xMax: 45, yMin: 46, yMax: 55 },
  { xMin: 52, xMax: 97, yMin: 46, yMax: 55 },
  // Row 6
  { xMin: 3, xMax: 48, yMin: 57, yMax: 66 },
  { xMin: 50, xMax: 97, yMin: 57, yMax: 66 },
  // Row 7
  { xMin: 3, xMax: 45, yMin: 68, yMax: 77 },
  { xMin: 52, xMax: 97, yMin: 68, yMax: 77 },
  // Row 8
  { xMin: 3, xMax: 48, yMin: 79, yMax: 88 },
  { xMin: 50, xMax: 97, yMin: 79, yMax: 88 },
  // Row 9
  { xMin: 3, xMax: 45, yMin: 90, yMax: 99 },
  { xMin: 52, xMax: 97, yMin: 90, yMax: 99 },
];

interface CloudItem {
  id: string;
  cluster_key: string | null;
  answer: string;
  enriched_answer?: string | null;
}

export function useCloudPositions(items: CloudItem[]): Map<string, Position> {
  const [positions, setPositions] = useState<Map<string, Position>>(new Map());
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

  // Listen for resize to recalculate on orientation/size change
  useEffect(() => {
    const handleResize = () => {
      const nowMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      if (nowMobile !== isMobile) {
        setIsMobile(nowMobile);
        setPositions(new Map()); // Force recalculation
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Memoize config based on isMobile
  const config = useMemo(() => ({
    zones: isMobile ? MOBILE_ZONES : DESKTOP_ZONES,
    minSpacing: isMobile ? MIN_SPACING_MOBILE : MIN_SPACING_DESKTOP,
  }), [isMobile]);

  // Generate initial position for a cluster
  const getInitialPosition = useCallback((clusterKey: string, index: number, itemIndex: number, size: Size): Position => {
    const hash = clusterKey.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const { zones } = config;
    
    // Use itemIndex to distribute across zones sequentially on mobile
    const zoneIndex = isMobile 
      ? itemIndex % zones.length 
      : Math.abs(hash) % zones.length;
    const zone = zones[zoneIndex];
    
    // Positions are used as CENTER coordinates (because items are translated -50%/-50%).
    // So the allowed center range must account for half the item size.
    const xMin = zone.xMin + size.w / 2;
    const xMax = zone.xMax - size.w / 2;
    const yMin = zone.yMin + size.h / 2;
    const yMax = zone.yMax - size.h / 2;

    const xRange = Math.max(0, xMax - xMin);
    const yRange = Math.max(0, yMax - yMin);
    const offsetX = (Math.abs(hash * (index + 1)) % 100) / 100 * Math.max(xRange, 0);
    const offsetY = (Math.abs(hash * (index + 2)) % 100) / 100 * Math.max(yRange, 0);
    
    return {
      x: xMin + offsetX,
      y: yMin + offsetY
    };
  }, [config, isMobile]);

  // Check if two items overlap
  const checkOverlap = useCallback((a: PositionedItem, b: PositionedItem): boolean => {
    const { minSpacing } = config;

    // Using center-based coordinates: overlap if distance between centers is less than
    // half-widths/half-heights + spacing.
    const overlapX =
      Math.abs(a.position.x - b.position.x) < (a.size.w / 2 + b.size.w / 2 + minSpacing);
    const overlapY =
      Math.abs(a.position.y - b.position.y) < (a.size.h / 2 + b.size.h / 2 + minSpacing);
    return overlapX && overlapY;
  }, [config]);

  // Calculate distance between two positions
  const getDistance = useCallback((a: Position, b: Position): number => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }, []);

  // Clamp position to valid zones
  const clampToZones = useCallback((pos: Position, size: Size): Position => {
    const { zones } = config;
    
    // Find the nearest zone
    let bestZone = zones[0];
    let bestDist = Infinity;
    
    for (const zone of zones) {
      const centerX = (zone.xMin + zone.xMax) / 2;
      const centerY = (zone.yMin + zone.yMax) / 2;
      const dist = getDistance(pos, { x: centerX, y: centerY });
      if (dist < bestDist) {
        bestDist = dist;
        bestZone = zone;
      }
    }
    
    const minX = bestZone.xMin + size.w / 2;
    const maxX = bestZone.xMax - size.w / 2;
    const minY = bestZone.yMin + size.h / 2;
    const maxY = bestZone.yMax - size.h / 2;

    return {
      x: minX <= maxX ? clamp(pos.x, minX, maxX) : (bestZone.xMin + bestZone.xMax) / 2,
      y: minY <= maxY ? clamp(pos.y, minY, maxY) : (bestZone.yMin + bestZone.yMax) / 2,
    };
  }, [config, getDistance]);

  // Resolve collisions using iterative relaxation
  const resolveCollisions = useCallback((items: PositionedItem[]): PositionedItem[] => {
    if (items.length <= 1) return items;
    
    const resolved = items.map(item => ({ ...item, position: { ...item.position } }));
    const iterations = 20; // Increased iterations for better resolution
    const pushStrength = isMobile ? 5 : 3; // Stronger push on mobile
    
    for (let iter = 0; iter < iterations; iter++) {
      let hasCollision = false;
      
      for (let i = 0; i < resolved.length; i++) {
        for (let j = i + 1; j < resolved.length; j++) {
          const a = resolved[i];
          const b = resolved[j];
          
          if (checkOverlap(a, b)) {
            hasCollision = true;
            
            // Calculate push direction
            let dx = b.position.x - a.position.x;
            let dy = b.position.y - a.position.y;
            
            // Avoid zero vector
            if (dx === 0 && dy === 0) {
              dx = (Math.random() - 0.5) * 4;
              dy = (Math.random() - 0.5) * 4;
            }
            
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const pushX = (dx / dist) * pushStrength;
            const pushY = (dy / dist) * pushStrength;
            
            // Push both items apart (newer items pushed more)
            const aWeight = 0.3;
            const bWeight = 0.7;
            
            a.position.x -= pushX * aWeight;
            a.position.y -= pushY * aWeight;
            b.position.x += pushX * bWeight;
            b.position.y += pushY * bWeight;
            
            // Clamp to valid zones
            a.position = clampToZones(a.position, a.size);
            b.position = clampToZones(b.position, b.size);
          }
        }
      }
      
      // Early exit if no collisions
      if (!hasCollision) break;
    }
    
    return resolved;
  }, [checkOverlap, clampToZones, isMobile]);

  // Group items by cluster
  const clusteredItems = useMemo(() => {
    const groups: Record<string, CloudItem[]> = {};
    items.forEach(item => {
      const key = item.cluster_key || item.answer.toLowerCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [items]);

  // Use layout effect to avoid a visible "pile-up" frame before positions resolve.
  useLayoutEffect(() => {
    // Build positioned items with initial positions
    const allItems: PositionedItem[] = [];
    let globalIndex = 0;
    
    Object.entries(clusteredItems).forEach(([clusterKey, clusterItems]) => {
      clusterItems.forEach((item, idx) => {
        // Check if we already have a position for this item
        const existingPos = positions.get(item.id);
        const displayText = item.enriched_answer || item.answer;
        const size = estimateItemSize(displayText, isMobile);
        const initialPos = existingPos || getInitialPosition(clusterKey, idx, globalIndex, size);
        
        allItems.push({
          id: item.id,
          clusterKey,
          clusterIndex: idx,
          position: initialPos,
          size,
        });
        globalIndex++;
      });
    });

    // Resolve collisions
    const resolved = resolveCollisions(allItems);
    
    // Update positions map
    const newPositions = new Map<string, Position>();
    resolved.forEach(item => {
      newPositions.set(item.id, item.position);
    });
    
    setPositions(newPositions);
  }, [clusteredItems, isMobile, getInitialPosition, resolveCollisions]);

  return positions;
}
