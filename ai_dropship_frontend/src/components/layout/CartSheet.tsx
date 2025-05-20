import { PropsWithChildren, ReactNode } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Using the local ui/sheet wrapper with fixed children support

interface CartSheetProps {
  trigger: ReactNode;
}

export function CartSheet({
  trigger,
  children,
}: PropsWithChildren<CartSheetProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
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
