import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SelectGroupsDemo() {
  return (
    <Select defaultValue="th">
      {/* The trigger names itself for assistive technology; the visible label
          is the chosen value, which is not a name. */}
      <SelectTrigger className="w-56" aria-label="Country">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="th">Thailand</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="kr">South Korea</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="pt" disabled>
            Portugal (unavailable)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
