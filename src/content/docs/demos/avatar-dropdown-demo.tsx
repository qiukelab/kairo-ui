import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AvatarDropdownDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* The avatar is decorative here — the button is what needs the name,
            so the alt is empty and the label lives on the control. */}
        <button
          type="button"
          aria-label="Open account menu"
          className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Avatar size="lg">
            <AvatarImage src="/avatars/03.svg" alt="" />
            <AvatarFallback>SP</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-44">
        <DropdownMenuLabel>Somchai Prasert</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
