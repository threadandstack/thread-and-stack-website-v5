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

// Mobile/Tablet zones - well-separated grid pattern
// Each zone is positioned to avoid overlapping with others
const generateMobileZones = (startYPercent: number): { xCenter: number; yCenter: number; radius: number }[] => {
  const rowGap = 22; // Generous gap between rows for books to spread
  return [
    // Row 1 - clearly separated left/right
    { xCenter: 28, yCenter: startYPercent, radius: 8 },
    { xCenter: 72, yCenter: startYPercent + 8, radius: 8 },
    // Row 2 - offset pattern
    { xCenter: 72, yCenter: startYPercent + rowGap, radius: 8 },
    { xCenter: 28, yCenter: startYPercent + rowGap + 8, radius: 8 },
    // Row 3
    { xCenter: 50, yCenter: startYPercent + rowGap * 2, radius: 8 },
    { xCenter: 28, yCenter: startYPercent + rowGap * 2 + 10, radius: 8 },
    // Row 4
    { xCenter: 72, yCenter: startYPercent + rowGap * 3, radius: 8 },
    { xCenter: 50, yCenter: startYPercent + rowGap * 3 + 8, radius: 8 },
    // Row 5 (overflow)
    { xCenter: 28, yCenter: startYPercent + rowGap * 4, radius: 8 },
    { xCenter: 72, yCenter: startYPercent + rowGap * 4 + 6, radius: 8 },
  ];
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

  const zones = useMemo(() => 
    isMobile ? generateMobileZones(mobileStartY) : GENRE_ZONES_DESKTOP, 
    [isMobile, mobileStartY]
  );
  const minSpacing = isMobile ? 4 : 2.5; // More spacing on mobile

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

  // Position items tightly around their genre's anchor point
  // Anchor is offset below the constellation label
  const positionItemsAroundAnchor = useCallback((
    zoneItems: CloudItem[],
    anchor: { x: number; y: number },
    maxRadius: number
  ): PositionedItem[] => {
    const positioned: PositionedItem[] = [];
    
    zoneItems.forEach((item, idx) => {
      const displayText = item.enriched_answer || item.answer;
      const size = estimateItemSize(displayText, isMobile);
      
      // Spread books in expanding rings around anchor
      const angle = (idx * 137.5 * Math.PI) / 180; // Golden angle for even distribution
      // More gradual expansion on mobile to use space better
      const distance = Math.min(maxRadius, isMobile ? 4 + idx * 2.5 : 2 + idx * 1.5);
      
      let pos: Position = {
        x: anchor.x + Math.cos(angle) * distance,
        y: anchor.y + Math.sin(angle) * distance * 0.7 // Compress vertically
      };
      
      // Clamp to valid screen area with safe margins to prevent edge clipping
      const safeMarginX = isMobile ? 8 : 5; // More margin on mobile to prevent edge clipping
      const safeMarginY = isMobile ? 6 : 4;
      pos.x = clamp(pos.x, size.w / 2 + safeMarginX, 100 - size.w / 2 - safeMarginX);
      pos.y = clamp(pos.y, size.h / 2 + safeMarginY, 100 - size.h / 2 - safeMarginY);
      
      positioned.push({
        id: item.id,
        genre: item.genre,
        position: pos,
        size,
        anchorX: anchor.x, // Store anchor for collision resolution
        anchorY: anchor.y
      });
    });
    
    return positioned;
  }, [isMobile]);

  // Resolve collisions while keeping items close to their anchor
  const resolveCollisions = useCallback((allItems: PositionedItem[], maxDriftFromAnchor: number): PositionedItem[] => {
    if (allItems.length <= 1) return allItems;
    
    const resolved = allItems.map(item => ({ 
      ...item, 
      position: { ...item.position } 
    }));
    
    const iterations = 50; // More iterations for cleaner layout
    const pushStrength = isMobile ? 5 : 3; // Stronger push on mobile
    const anchorPull = 0.15; // Pull items back toward their anchor each iteration
    
    for (let iter = 0; iter < iterations; iter++) {
      let hasCollision = false;
      
      // First, resolve collisions
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
            
            a.position.x -= pushX * 0.4;
            a.position.y -= pushY * 0.4;
            b.position.x += pushX * 0.6;
            b.position.y += pushY * 0.6;
          }
        }
      }
      
      // Then, pull items back toward their anchors (keeps clusters cohesive)
      for (const item of resolved) {
        if (item.anchorX !== undefined && item.anchorY !== undefined) {
          const dxToAnchor = item.anchorX - item.position.x;
          const dyToAnchor = item.anchorY - item.position.y;
          const distToAnchor = Math.sqrt(dxToAnchor * dxToAnchor + dyToAnchor * dyToAnchor);
          
          // Only pull if drifted beyond max allowed distance
          if (distToAnchor > maxDriftFromAnchor) {
            item.position.x += dxToAnchor * anchorPull;
            item.position.y += dyToAnchor * anchorPull;
          }
        }
        
        // Clamp to valid areas with safe margins
        const safeMarginX = isMobile ? 8 : 5;
        const safeMarginY = isMobile ? 6 : 4;
        item.position.x = clamp(item.position.x, item.size.w / 2 + safeMarginX, 100 - item.size.w / 2 - safeMarginX);
        item.position.y = clamp(item.position.y, item.size.h / 2 + safeMarginY, 100 - item.size.h / 2 - safeMarginY);
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

    // STEP 1: Establish fixed anchor positions for each genre (constellation labels)
    // These are the authoritative positions - books will cluster around them
    const anchors = new Map<string, Position>();
    const minAnchorY = isMobile ? 12 : 14; // Ensure labels don't overlap navigation
    
    Object.keys(genreGroups).forEach(genre => {
      const zoneIdx = genreZoneAssignments.get(genre) || 0;
      const zone = zones[zoneIdx];
      
      // Anchor is at the zone center - this is where the constellation label appears
      anchors.set(genre, {
        x: zone.xCenter,
        y: Math.max(minAnchorY, zone.yCenter)
      });
    });

    // STEP 2: Position books tightly around their genre's anchor
    // Books appear below/around the constellation label
    let allPositioned: PositionedItem[] = [];
    const bookClusterRadius = isMobile ? 14 : 12; // Larger radius on mobile
    const bookOffsetY = isMobile ? 8 : 8; // Books start below the label
    
    Object.entries(genreGroups).forEach(([genre, groupItems]) => {
      const anchor = anchors.get(genre);
      if (!anchor) return;
      
      // Books cluster below and around the anchor point
      const bookAnchor = {
        x: anchor.x,
        y: Math.min(95, anchor.y + bookOffsetY) // Offset books below the label
      };
      
      const positioned = positionItemsAroundAnchor(groupItems, bookAnchor, bookClusterRadius);
      allPositioned = [...allPositioned, ...positioned];
    });

    // STEP 3: Resolve collisions while keeping books near their anchors
    const maxDrift = isMobile ? 20 : 18; // Allow more drift on mobile for spacing
    const resolved = resolveCollisions(allPositioned, maxDrift);

    const newPositions = new Map<string, Position>();
    resolved.forEach(item => {
      newPositions.set(item.id, item.position);
    });
    
    positionedIdsRef.current = itemIdsSet;
    setPositions(newPositions);
    setGenreAnchors(anchors); // Use the fixed anchors, not recalculated ones
  }, [items, genreGroups, genreZoneAssignments, zones, positionItemsAroundAnchor, resolveCollisions, isMobile, positions.size]);

  return { positions, genreAnchors };
}
