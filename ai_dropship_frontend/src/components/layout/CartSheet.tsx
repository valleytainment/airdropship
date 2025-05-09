import { PropsWithChildren, ReactNode } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@radix-ui/react-dialog"; // Changed import as per audit

interface CartSheetProps {
  trigger: ReactNode;
}

// Using PropsWithChildren as per audit
export function CartSheet({
  trigger,
  children,
}: PropsWithChildren<CartSheetProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {/* Previous fix for children prop on SheetContent is maintained here */}
      {/* The audit suggests SheetContent from @radix-ui/react-dialog might handle children differently */}
      {/* For now, keeping the structure that previously passed build, but with new imports */}
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

