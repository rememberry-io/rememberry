import classNames from "classnames";
import React, { useRef, useState } from "react";
import { Position } from "reactflow";
import { CustomHandle } from "../FlashcardComponents/CustomHandle";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface StackProps {
  data: {
    frontText: string;
    backText: string;
  };
}

export const Stack: React.FC<StackProps> = ({ data }) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [frontText, setFrontText] = useState(data.frontText);
  const [backText, setBackText] = useState(data.backText);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, frontText);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setFrontText(val);
  };

  return (
    <div>
      <div className="flex flex-row items-center">
        <button onClick={() => setInputOpen(true)}>
          <div
            className={classNames(
              `flex text-center flex-col p-3 text-white rounded-md bg-primary justify-center `,
              { "outline outline-gray-300": inputOpen },
            )}
          >
            {inputOpen && (
              <>
                <textarea
                  className="text-xl bg-primary rounded-md h-fit outline-none resize-none  break-words"
                  defaultValue={frontText}
                  placeholder="Give this stack a name"
                  ref={textAreaRef}
                  onBlur={() => setInputOpen(false)}
                  rows={1}
                  onChange={handleChange}
                />
              </>
            )}
            {!inputOpen && (
              <textarea
                className="text-xl bg-primary rounded-md h-fit outline-none resize-none  break-words"
                defaultValue={frontText}
                ref={textAreaRef}
                rows={1}
              />
            )}
          </div>
        </button>
        <CustomHandle position={Position.Top} />
        <CustomHandle position={Position.Bottom} />
      </div>
    </div>
  );
};
