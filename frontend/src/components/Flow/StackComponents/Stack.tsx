import classNames from "classnames";
import React, { useRef, useState } from "react";
import { Position } from "reactflow";
import { CustomHandle } from "../FlashcardComponents/CustomHandle";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

interface StackProps {
  data: {
    stackName: string;
  };
}

export const Stack: React.FC<StackProps> = ({ data }) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [stackName, setStackName] = useState(data.stackName);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, stackName);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setStackName(val);
  };

  // todo: update stackName of all the child nodes

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
                  defaultValue={stackName}
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
                defaultValue={stackName}
                ref={textAreaRef}
                rows={1}
              />
            )}
          </div>
        </button>

        <CustomHandle position={Position.Bottom} />
      </div>
    </div>
  );
};
