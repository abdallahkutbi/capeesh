import * as React from "react"
import { Pressable, Text, View } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "flex items-center justify-center rounded-md font-medium disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary active:opacity-90",
        destructive: "bg-destructive active:opacity-90",
        outline: "border border-input bg-background active:bg-accent",
        secondary: "bg-secondary active:opacity-80",
        ghost: "active:bg-accent",
        link: "active:opacity-80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

const Button = React.forwardRef<View, ButtonProps>(
  ({ className, variant, size, children, disabled, ...props }, ref) => {
    return (
      <Pressable
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        <Text
          className={cn(
            "font-medium text-sm",
            variant === "link" && "text-primary",
            variant === "ghost" && "text-foreground",
            variant === "outline" && "text-foreground",
            variant === "secondary" && "text-secondary-foreground",
            variant === "destructive" && "text-destructive-foreground",
            (!variant || variant === "default") && "text-primary-foreground"
          )}
        >
          {children}
        </Text>
      </Pressable>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
