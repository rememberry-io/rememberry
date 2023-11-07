import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DropDown() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Show difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="flex flex-col">
          <SelectLabel>How to show the difficulty</SelectLabel>
          <SelectItem value="apple">Colored borders</SelectItem>
          <SelectItem value="banana">Colored flashcards</SelectItem>
          <SelectItem value="blueberry">Not at all</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
