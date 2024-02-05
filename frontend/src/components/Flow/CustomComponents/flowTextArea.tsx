export const FlowInput = ({
  className,
  value,
  textAreaRef,
  rows,
  readOnly,
  placeholder,
  changes,
  isStack,
  isInput,
}: {
  className: string;
  value: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  rows: number;
  readOnly: boolean;
  placeholder: string;
  isStack: boolean;
  isInput: boolean;

  changes: (value: string) => void;
}) => {
  const stackProps = isStack
    ? "bg-primary text-white"
    : `dark:bg-dark-600  `;
  const inputProps = isInput
    ? "outline focus:outline-primary bg-slate-50 mt-5 "
    : " outline-none";

  return (
    <textarea
      className={` outline-none  rounded-md h-fit resize-none break-words flex items-center p-2 justify-between w-full ${stackProps} ${inputProps}  `}
      value={value}
      ref={textAreaRef}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      onChange={(e) => changes(e.target.value)}
    />
  );
};
