export const FlowTextArea = ({
  className,
  value,
  textAreaRef,
  rows,
  readOnly,
  placeholder,
  changes,
  isStack,
  isInput,
  onSubmit,
}: {
  className: string;
  value: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  rows: number;
  readOnly: boolean;
  placeholder: string;
  isStack: boolean;
  isInput: boolean;
  onSubmit: () => void;
  changes: (value: string) => void;
}) => {
  const stackProps = isStack ? "bg-primary text-white" : `dark:bg-dark-600  `;
  const inputProps = isInput
    ? "outline focus:outline-primary bg-gray-100 mt-5 "
    : " outline-none";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action to avoid a newline being added
      onSubmit(); 
    }
  };

  return (
    <textarea
      className={` outline-none  rounded-md h-fit resize-none break-words flex items-center p-2 justify-between w-full ${stackProps} ${inputProps}  `}
      value={value}
      ref={textAreaRef}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      onChange={(e) => changes(e.target.value)}
      onKeyDown={handleKeyDown} 
    />
  );
};
