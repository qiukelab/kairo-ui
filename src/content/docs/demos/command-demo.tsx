import {
  CopyIcon,
  FileIcon,
  FolderIcon,
  FolderPlusIcon,
  HouseIcon,
  InboxIcon,
  PlusIcon,
} from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

const groups = [
  {
    heading: 'Navigation',
    items: [
      { icon: HouseIcon, label: 'Home', shortcut: '⌘H' },
      { icon: InboxIcon, label: 'Inbox', shortcut: '⌘I' },
      { icon: FileIcon, label: 'Documents', shortcut: '⌘D' },
      { icon: FolderIcon, label: 'Folders', shortcut: '⌘F' },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { icon: PlusIcon, label: 'New File', shortcut: '⌘N' },
      { icon: FolderPlusIcon, label: 'New Folder', shortcut: '⇧⌘N' },
      { icon: CopyIcon, label: 'Copy', shortcut: '⌘C' },
    ],
  },
]

export default function CommandDemo() {
  return (
    <Command className="w-full max-w-md rounded-lg border border-border shadow-card">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, index) => (
          <div key={group.heading}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem key={item.label}>
                  <item.icon />
                  {item.label}
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </Command>
  )
}
