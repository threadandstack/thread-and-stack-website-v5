import { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface HandDrawnIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const HandDrawnArrowRight = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      // Arrow line
      const line = rc.line(4, 12, 18, 12, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        bowing: 0.5,
      });
      
      // Arrow head
      const arrowHead = rc.path('M 18 12 L 13 8 M 18 12 L 13 16', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        bowing: 0.5,
      });
      
      svgRef.current.appendChild(line);
      svgRef.current.appendChild(arrowHead);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnCheck = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      const check = rc.path('M 5 13 L 9 17 L 19 7', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        bowing: 0.5,
      });
      
      svgRef.current.appendChild(check);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnClock = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      const circle = rc.circle(12, 12, 18, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      const hourHand = rc.line(12, 12, 12, 7, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      const minuteHand = rc.line(12, 12, 16, 12, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      svgRef.current.appendChild(circle);
      svgRef.current.appendChild(hourHand);
      svgRef.current.appendChild(minuteHand);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnZap = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      const lightning = rc.path('M 13 2 L 3 14 L 11 14 L 11 22 L 21 10 L 13 10 L 13 2', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        bowing: 0.8,
        fill: 'none',
      });
      
      svgRef.current.appendChild(lightning);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnUsers = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      // First person head
      const head1 = rc.circle(9, 7, 6, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      // First person body
      const body1 = rc.path('M 4 21 Q 4 17 6 15 Q 9 13 12 15 Q 14 17 14 21', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      // Second person head (partial)
      const head2 = rc.arc(17, 7, 6, 6, -0.5, 2.64, false, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      // Second person body (partial)
      const body2 = rc.path('M 14 21 Q 16 17 18 15 Q 20 14 22 16', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      svgRef.current.appendChild(head1);
      svgRef.current.appendChild(body1);
      svgRef.current.appendChild(head2);
      svgRef.current.appendChild(body2);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnTarget = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      const outerCircle = rc.circle(12, 12, 18, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      const middleCircle = rc.circle(12, 12, 12, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      const innerCircle = rc.circle(12, 12, 4, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: color,
        fillStyle: 'solid',
      });
      
      svgRef.current.appendChild(outerCircle);
      svgRef.current.appendChild(middleCircle);
      svgRef.current.appendChild(innerCircle);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnRepeat = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      // Top arrow
      const topArrow = rc.path('M 17 2 L 21 6 L 17 10 M 21 6 L 3 6 Q 1 6 1 8 L 1 11', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        bowing: 0.5,
        fill: 'none',
      });
      
      // Bottom arrow
      const bottomArrow = rc.path('M 7 22 L 3 18 L 7 14 M 3 18 L 21 18 Q 23 18 23 16 L 23 13', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        bowing: 0.5,
        fill: 'none',
      });
      
      svgRef.current.appendChild(topArrow);
      svgRef.current.appendChild(bottomArrow);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnCalendar = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      const rect = rc.rectangle(3, 4, 18, 18, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      const topLine = rc.line(3, 10, 21, 10, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      const hanger1 = rc.line(7, 2, 7, 6, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      const hanger2 = rc.line(17, 2, 17, 6, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      svgRef.current.appendChild(rect);
      svgRef.current.appendChild(topLine);
      svgRef.current.appendChild(hanger1);
      svgRef.current.appendChild(hanger2);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnLayers = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      const layer1 = rc.path('M 12 2 L 22 7 L 12 12 L 2 7 L 12 2', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      const layer2 = rc.path('M 2 12 L 12 17 L 22 12', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      const layer3 = rc.path('M 2 17 L 12 22 L 22 17', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      svgRef.current.appendChild(layer1);
      svgRef.current.appendChild(layer2);
      svgRef.current.appendChild(layer3);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};

export const HandDrawnFileText = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 2,
  className 
}: HandDrawnIconProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current);
      svgRef.current.innerHTML = '';
      
      const doc = rc.path('M 6 2 L 14 2 L 18 6 L 18 22 L 6 22 L 6 2', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
        fill: 'none',
      });
      
      const corner = rc.path('M 14 2 L 14 6 L 18 6', {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      const line1 = rc.line(9, 11, 15, 11, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      const line2 = rc.line(9, 15, 15, 15, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      const line3 = rc.line(9, 19, 13, 19, {
        stroke: color,
        strokeWidth: strokeWidth,
        roughness: 1.5,
      });
      
      svgRef.current.appendChild(doc);
      svgRef.current.appendChild(corner);
      svgRef.current.appendChild(line1);
      svgRef.current.appendChild(line2);
      svgRef.current.appendChild(line3);
    }
  }, [color, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    />
  );
};
