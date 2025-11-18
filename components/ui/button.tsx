import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Update the button variants to perfectly match the app's color scheme and design language
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-['Verdana',sans-serif]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground hover:border-accent",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90",
        accent: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New variants based on login/signup buttons
        "ghost-primary":
          "border border-primary/20 bg-background/50 text-primary hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
        "primary-gradient":
          "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-primary-400 hover:to-secondary-400",
        "accent-gradient":
          "bg-gradient-to-r from-accent-500 to-accent-700 text-accent-foreground shadow-md hover:shadow-lg",
        "flashing-orange": "bg-orange-500 text-white shadow-md border-4 border-orange-400 animate-[flash_1.5s_ease-in-out_infinite] hover:bg-orange-600 hover:border-orange-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 py-1 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "relative text-transparent pointer-events-none",
          loading &&
            "after:content-[''] after:absolute after:w-5 after:h-5 after:border-2 after:border-t-current after:border-r-current after:border-b-transparent after:border-l-transparent after:rounded-full after:animate-spin after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

