import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropDownProps {
  level: string;
  levelHandler: (level: string) => void;

}


//TODO: level handler shown from database, therefore later on passed through props

export function DropDown({ level, levelHandler,  }: DropDownProps) {
  return (
    <Select>
      <SelectTrigger className="[w-auto]  dark:bg-dark-800  hover:dark:bg-dark-600 hover:bg-gray-50">
        <SelectValue placeholder={level} />
      </SelectTrigger>
      <SelectContent className="flex flex-col  dark:bg-dark-800  ">
        <SelectGroup className="">
          <SelectLabel>How do you want to see the level?</SelectLabel>
          <SelectItem
            onClick={() => levelHandler("borders")}
            className=""
            value="borders"
          >
            Colored borders
          </SelectItem>
          <SelectItem
            onClick={() => levelHandler("area")}
            className=""
            value="area"
          >
            Colored flashcards
          </SelectItem>
          <SelectItem onClick={() => levelHandler("none")}  value="none">
            Not at all
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
