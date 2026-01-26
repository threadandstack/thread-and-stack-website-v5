import { useState, useEffect, useMemo } from "react";

interface Position {
  x: number;
  y: number;
}

interface PositionedItem {
  id: string;
  clusterKey: string;
  clusterIndex: number;
  position: Position;
}

// Approximate item dimensions in percentage of viewport
const ITEM_WIDTH_DESKTOP = 12;
const ITEM_HEIGHT_DESKTOP = 4;
const ITEM_WIDTH_MOBILE = 35; // Wider on mobile (items take more relative space)
const ITEM_HEIGHT_MOBILE = 6;
const MIN_SPACING = 2;

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

// Mobile/Tablet zones: Vertical stacking below the input
// Items spread across the full width but stack vertically
const MOBILE_ZONES = [
  // Row 1 (closest to input)
  { xMin: 5, xMax: 50, yMin: 3, yMax: 12 },
  { xMin: 45, xMax: 95, yMin: 3, yMax: 12 },
  // Row 2
  { xMin: 3, xMax: 55, yMin: 12, yMax: 21 },
  { xMin: 40, xMax: 97, yMin: 12, yMax: 21 },
  // Row 3
  { xMin: 5, xMax: 50, yMin: 21, yMax: 30 },
  { xMin: 45, xMax: 95, yMin: 21, yMax: 30 },
  // Row 4
  { xMin: 3, xMax: 55, yMin: 30, yMax: 39 },
  { xMin: 40, xMax: 97, yMin: 30, yMax: 39 },
  // Row 5
  { xMin: 5, xMax: 50, yMin: 39, yMax: 48 },
  { xMin: 45, xMax: 95, yMin: 39, yMax: 48 },
  // Row 6
  { xMin: 3, xMax: 55, yMin: 48, yMax: 57 },
  { xMin: 40, xMax: 97, yMin: 48, yMax: 57 },
  // Row 7
  { xMin: 5, xMax: 50, yMin: 57, yMax: 66 },
  { xMin: 45, xMax: 95, yMin: 57, yMax: 66 },
  // Row 8
  { xMin: 3, xMax: 55, yMin: 66, yMax: 75 },
  { xMin: 40, xMax: 97, yMin: 66, yMax: 75 },
  // Row 9
  { xMin: 5, xMax: 50, yMin: 75, yMax: 84 },
  { xMin: 45, xMax: 95, yMin: 75, yMax: 84 },
  // Row 10
  { xMin: 3, xMax: 55, yMin: 84, yMax: 93 },
  { xMin: 40, xMax: 97, yMin: 84, yMax: 93 },
];

const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

const getEdgeZones = () => getIsMobile() ? MOBILE_ZONES : DESKTOP_ZONES;
const getItemWidth = () => getIsMobile() ? ITEM_WIDTH_MOBILE : ITEM_WIDTH_DESKTOP;
const getItemHeight = () => getIsMobile() ? ITEM_HEIGHT_MOBILE : ITEM_HEIGHT_DESKTOP;

// Generate initial position for a cluster
const getInitialPosition = (clusterKey: string, index: number, itemIndex: number): Position => {
  const hash = clusterKey.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const zones = getEdgeZones();
  const itemWidth = getItemWidth();
  const itemHeight = getItemHeight();
  
  // Use itemIndex to distribute across zones sequentially on mobile
  const isMobile = getIsMobile();
  const zoneIndex = isMobile 
    ? itemIndex % zones.length 
    : Math.abs(hash) % zones.length;
  const zone = zones[zoneIndex];
  
  const xRange = zone.xMax - zone.xMin - itemWidth;
  const yRange = zone.yMax - zone.yMin - itemHeight;
  const offsetX = (Math.abs(hash * (index + 1)) % 100) / 100 * Math.max(xRange, 0);
  const offsetY = (Math.abs(hash * (index + 2)) % 100) / 100 * Math.max(yRange, 0);
  
  return {
    x: zone.xMin + offsetX,
    y: zone.yMin + offsetY
  };
};

// Check if two items overlap
const checkOverlap = (a: Position, b: Position): boolean => {
  const itemWidth = getItemWidth();
  const itemHeight = getItemHeight();
  const overlapX = Math.abs(a.x - b.x) < (itemWidth + MIN_SPACING);
  const overlapY = Math.abs(a.y - b.y) < (itemHeight + MIN_SPACING);
  return overlapX && overlapY;
};

// Calculate distance between two positions
const getDistance = (a: Position, b: Position): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

// Clamp position to valid zones
const clampToZones = (pos: Position): Position => {
  const zones = getEdgeZones();
  const itemWidth = getItemWidth();
  const itemHeight = getItemHeight();
  
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
  
  return {
    x: Math.max(bestZone.xMin, Math.min(bestZone.xMax - itemWidth, pos.x)),
    y: Math.max(bestZone.yMin, Math.min(bestZone.yMax - itemHeight, pos.y))
  };
};

// Resolve collisions using iterative relaxation
const resolveCollisions = (items: PositionedItem[]): PositionedItem[] => {
  if (items.length <= 1) return items;
  
  const resolved = items.map(item => ({ ...item, position: { ...item.position } }));
  const iterations = 12;
  const pushStrength = 3;
  
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < resolved.length; i++) {
      for (let j = i + 1; j < resolved.length; j++) {
        const a = resolved[i];
        const b = resolved[j];
        
        if (checkOverlap(a.position, b.position)) {
          // Calculate push direction
          let dx = b.position.x - a.position.x;
          let dy = b.position.y - a.position.y;
          
          // Avoid zero vector
          if (dx === 0 && dy === 0) {
            dx = (Math.random() - 0.5) * 2;
            dy = (Math.random() - 0.5) * 2;
          }
          
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const pushX = (dx / dist) * pushStrength;
          const pushY = (dy / dist) * pushStrength;
          
          // Push both items apart (newer items pushed more)
          const aWeight = i < j ? 0.3 : 0.7;
          const bWeight = 1 - aWeight;
          
          a.position.x -= pushX * aWeight;
          a.position.y -= pushY * aWeight;
          b.position.x += pushX * bWeight;
          b.position.y += pushY * bWeight;
          
          // Clamp to valid zones
          a.position = clampToZones(a.position);
          b.position = clampToZones(b.position);
        }
      }
    }
  }
  
  return resolved;
};

interface CloudItem {
  id: string;
  cluster_key: string | null;
  answer: string;
}

export function useCloudPositions(items: CloudItem[]): Map<string, Position> {
  const [positions, setPositions] = useState<Map<string, Position>>(new Map());
  const [isMobile, setIsMobile] = useState(getIsMobile());

  // Listen for resize to recalculate on orientation/size change
  useEffect(() => {
    const handleResize = () => {
      const nowMobile = getIsMobile();
      if (nowMobile !== isMobile) {
        setIsMobile(nowMobile);
        setPositions(new Map()); // Force recalculation
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

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

  useEffect(() => {
    // Build positioned items with initial positions
    const allItems: PositionedItem[] = [];
    let globalIndex = 0;
    
    Object.entries(clusteredItems).forEach(([clusterKey, clusterItems]) => {
      clusterItems.forEach((item, idx) => {
        // Check if we already have a position for this item
        const existingPos = positions.get(item.id);
        const initialPos = existingPos || getInitialPosition(clusterKey, idx, globalIndex);
        
        allItems.push({
          id: item.id,
          clusterKey,
          clusterIndex: idx,
          position: initialPos
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
  }, [clusteredItems, isMobile]);

  return positions;
}
