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
      <SelectTrigger className="[w-auto]  dark:bg-dark-800  hover:dark:bg-dark-600 hover:bg-gray-50">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent className="flex flex-col  dark:bg-dark-800  ">
        <SelectGroup className="">
          <SelectLabel>How do you want to see the difficulty?</SelectLabel>
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
