export const FlowInput = ({
  className,
  value,
  textAreaRef,
  rows,
  readOnly,
}: {
  className: string;
  value: string;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  rows: number;
  readOnly: boolean;
}) => (
  <textarea
    className={className}
    value={value}
    ref={textAreaRef}
    rows={rows}
    readOnly={readOnly}
  />
);
