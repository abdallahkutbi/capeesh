import * as React from "react"
import { TextInput } from "react-native"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        placeholderTextColor="hsl(215.4 16.3% 46.9%)"
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
