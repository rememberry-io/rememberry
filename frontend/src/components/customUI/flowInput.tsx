

export const FlowInput = ({ className, value, textAreaRef, rows, readOnly }: { className: string, value: string, textAreaRef: React.RefObject<HTMLTextAreaElement>, rows: number, readOnly: boolean }) => (
    <div
    className="h-fit  resize-none break-words flex items-center justify-between">
    <textarea
      className={className}
      value={value}
      ref={textAreaRef}
      rows={rows}
      readOnly={readOnly}
    /></div>
  );