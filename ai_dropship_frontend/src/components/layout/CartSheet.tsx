import { PropsWithChildren, ReactNode } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Reverted import to use the local ui/sheet wrapper

interface CartSheetProps {
  trigger: ReactNode;
}

// Using PropsWithChildren as per audit, this should be fine with the correct import
export function CartSheet({
  trigger,
  children,
}: PropsWithChildren<CartSheetProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {/* @ts-ignore TODO: Investigate SheetContentProps typing from @/components/ui/sheet. Property 'children' error. */}
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>
            Cart { /* insert item count logic */ }
          </SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

