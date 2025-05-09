import React from "react"
import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle
} from "@/components/ui/sheet"

interface CartSheetProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

export function CartSheet({ trigger, children }: CartSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent asChild>
        <div className="flex w-full flex-col pr-0 sm:max-w-lg">
          <SheetHeader className="px-6">
            <SheetTitle>
              Cart { /* insert item count logic */ }
            </SheetTitle>
          </SheetHeader>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}

