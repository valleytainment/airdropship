import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

export function ScrollArea(props: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return <ScrollAreaPrimitive.Root {...props} />
}
