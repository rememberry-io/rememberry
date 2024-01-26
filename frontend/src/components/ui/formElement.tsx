import { Field } from "formik";
import { Input } from "./input";

type FormElement = {
  id: string;
  placeholder: string;
  type: string;
};

export default function FormElement({ id, placeholder, type }: FormElement) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={type}>
        <p className="text-sm font-medium">{placeholder}</p>
      </label>
      <Field
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
