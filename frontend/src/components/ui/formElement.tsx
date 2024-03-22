import { Field } from "formik";
import { Input } from "./input";

type FormElementProps = {
  id: string;
  placeholder: string;
  type: string;
};

export default function FormElement({
  id,
  placeholder,
  type,
}: FormElementProps) {
  return (
    <div className="flex flex-col gap-1 dark:bg-dark-800">
      <label htmlFor={type}>
        <p className="text-sm font-medium dark:bg-dark-800">{placeholder}</p>
      </label>
      <Field
        className="  bg-gray-100 dark:bg-dark-700 border-none dark:text-white dark:placeholder:text-white/50"
        as={Input}
        crossOrigin="anonymous"
        id={id}
        name={id}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}
