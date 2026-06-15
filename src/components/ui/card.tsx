import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  disableTilt?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, disableTilt, ...props }, ref) => {
  const card = (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        !disableTilt && "transition-transform duration-300 ease-out [transform-style:preserve-3d]",
        className
      )}
      style={disableTilt ? undefined : {
        transform: "rotateX(var(--g-ty, 0deg)) rotateY(var(--g-tx, 0deg))",
      }}
      {...props}
    />
  );

  if (disableTilt) return card;

  return (
    <div
      style={{ perspective: "1400px" }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const tx = (px - 0.5) * 2 * 6;
        const ty = (0.5 - py) * 2 * 5;
        el.style.setProperty("--g-tx", `${tx}deg`);
        el.style.setProperty("--g-ty", `${ty}deg`);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.setProperty("--g-tx", `0deg`);
        el.style.setProperty("--g-ty", `0deg`);
      }}
    >
      {card}
    </div>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
