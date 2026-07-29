import {
  ExternalLinkIcon,
  InfoIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  PencilIcon,
  PlusIcon,
  Share2Icon,
  Trash2Icon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const jobs = [
  {
    id: '1',
    title: 'One-page landing site — modern, responsive on every device',
    thumbnail: '/placeholder.svg',
    fee: 18,
    goal: 30_000,
    status: 'Approved',
    visible: true,
  },
]

const actions = [
  { icon: MegaphoneIcon, label: 'Promote' },
  { icon: Share2Icon, label: 'Share' },
  { icon: MessageSquareIcon, label: 'Messages for' },
  { icon: PencilIcon, label: 'Edit' },
  { icon: Trash2Icon, label: 'Delete' },
]

/** An icon beside a column name has to be a real button, or the explanation is
 *  pointer-only: an `svg` with a `title` cannot take focus. */
function HeadInfo({ label }: { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="rounded-sm text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <InfoIcon aria-hidden className="size-3.5" />
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export default function TableJobsDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="font-semibold">My jobs (1/10)</p>
        <Button size="sm" className="ml-auto">
          <PlusIcon />
          New job
        </Button>
      </div>

      {/* A floor, because this table has to scroll either way. Without one the
          browser squeezes every column to its longest word to postpone the
          scrollbar, and then still shows it — the title breaks over six lines
          and nothing is gained. Set the width the columns need and let the
          container scroll to it. */}
      <Table className="min-w-[58rem]">
        <TableHeader className="bg-surface-soft">
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center gap-1">
                Fee (%)
                <HeadInfo label="The commission taken from each completed job" />
              </span>
            </TableHead>
            {/* A tinted column is a class on the header *and* on every cell
                beneath it. A table has no column object to style — a column is
                only ever the cells that line up. */}
            <TableHead className="bg-primary/8 text-right dark:bg-primary/12">
              <span className="inline-flex items-center gap-1">
                Goal for 0% fee
                <HeadInfo label="Earn this much from one customer and the fee drops to zero" />
              </span>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead className="text-right">Manage</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="max-w-72">
                <div className="flex items-start gap-3">
                  <img
                    src={job.thumbnail}
                    alt=""
                    className="size-12 shrink-0 rounded-md object-cover"
                  />
                  {/* The title wraps rather than truncating: it is the thing
                      being identified, so cutting it off defeats the row. */}
                  <span className="text-sm font-medium text-wrap">{job.title}</span>
                  <Button variant="ghost" size="icon-xs" asChild className="mt-0.5 shrink-0">
                    <a href="#preview" aria-label={`Open ${job.title} in a new tab`}>
                      <ExternalLinkIcon />
                    </a>
                  </Button>
                </div>
              </TableCell>

              <TableCell className="text-right tabular-nums">{job.fee}%</TableCell>

              <TableCell className="bg-primary/8 text-right dark:bg-primary/12">
                <span className="font-medium text-primary tabular-nums">
                  ฿{job.goal.toLocaleString('en')}
                </span>
                <span className="block text-xs text-muted-foreground">per customer</span>
              </TableCell>

              <TableCell>
                <Badge variant="soft" size="sm">
                  {job.status}
                </Badge>
              </TableCell>

              <TableCell>
                {/* A switch, not a checkbox: flipping it publishes the job
                    immediately rather than staging a value to submit. */}
                <Switch defaultChecked={job.visible} aria-label={`Show ${job.title} publicly`} />
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-end gap-0.5">
                  {actions.map((action) => (
                    <Button key={action.label} variant="ghost" size="icon-sm">
                      <action.icon />
                      {/* Named per row. Five buttons called "Edit" across five
                          rows are indistinguishable in a control list. */}
                      <span className="sr-only">{`${action.label} ${job.title}`}</span>
                    </Button>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
