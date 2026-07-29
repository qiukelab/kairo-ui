import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { mainNav, siteConfig } from '@/lib/site'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Open navigation">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0">
        <SheetTitle className="border-b border-border px-4 py-3.5 text-left">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              k
            </span>
            {siteConfig.name}
          </Link>
        </SheetTitle>

        <div className="overflow-y-auto px-2 py-4">
          <div className="mb-4 flex flex-col gap-0.5 border-b border-border px-1 pb-4 text-sm">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <DocsSidebar onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
