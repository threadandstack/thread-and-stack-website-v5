import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillButtonVariants = cva(
  "group inline-flex items-center justify-center gap-0 whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-full font-sans not-italic",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        dark: "bg-accent-foreground text-accent hover:bg-accent-foreground/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        outline: "border border-input bg-background hover:bg-muted hover:text-foreground",
        ghost: "hover:bg-muted hover:text-foreground",
        indigo: "bg-indigo text-white hover:bg-indigo/90",
        white: "bg-white text-indigo hover:bg-white/90",
        gradient: "text-white hover:-translate-y-px shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
      },
      size: {
        default: "h-10 px-5 py-2 text-sm",
        sm: "h-9 px-4 text-sm",
        lg: "h-11 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillButtonVariants> {
  asChild?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, variant, size, asChild = false, icon: Icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(pillButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? (
          // When asChild, children is the <a> tag - we need to pass content through
          React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<any>, {
                className: cn("flex items-center", (children as React.ReactElement<any>).props.className),
                children: (
                  <>
                    {Icon && (
                      <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
                        <Icon className="w-4 h-4 shrink-0" />
                      </span>
                    )}
                    {(children as React.ReactElement<any>).props.children}
                  </>
                ),
              })
            : children
        ) : (
          <>
            {Icon && (
              <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
                <Icon className="w-4 h-4 shrink-0" />
              </span>
            )}
            {children}
          </>
        )}
      </Comp>
    );
  }
);

PillButton.displayName = "PillButton";

export { PillButton, pillButtonVariants };
