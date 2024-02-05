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
      <SelectTrigger className="w-[180px]  dark:bg-dark-700 hover:bg-gray-100">
        <SelectValue placeholder="Show difficulty" />
      </SelectTrigger>
      <SelectContent className="flex flex-col  dark:bg-dark-700 ">
        <SelectGroup className="">
          <SelectLabel>How to show the difficulty</SelectLabel>
          <SelectItem className="" value="apple">
            Colored borders
          </SelectItem>
          <SelectItem className="" value="banana">
            Colored flashcards
          </SelectItem>
          <SelectItem value="blueberry">Not at all</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
