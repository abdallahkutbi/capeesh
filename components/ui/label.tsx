import * as React from "react"
import { Text } from "react-native"
import { cn } from "@/lib/utils"

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof Text> {}

const Label = React.forwardRef<Text, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
