export const FlowTextArea = ({
  className,
  value,
  textAreaRef,
  rows,

  placeholder,
  changes,

  isInput,
  onSubmit,
}: {
  className: string;
  value: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  rows: number;
  placeholder: string;
  isInput: boolean;
  onSubmit: () => void;
  changes: (value: string) => void;
}) => {
  const inputProps = isInput
    ? "focus:outline-primary bg-gray-100 focus:outline-primary mt-5 dark:bg-dark-700  "
    : "outline-none focus:outline-none focus:ring-0  focus:ring-offset-0 dark:bg-dark-800";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action to avoid a newline being added
      onSubmit();
    }
  };

  return (
    <textarea
      className={`${inputProps} hover:cursor-pointer read-only:visible  rounded-md resize-none break-words flex items-center p-2 justify-between w-full ${className}`}
      value={value}
      ref={textAreaRef}
      placeholder={placeholder}
      rows={rows}
      readOnly={!isInput}
      onChange={(e) => changes(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};
