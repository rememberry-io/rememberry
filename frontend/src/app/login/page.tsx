"use client";
import { Flashcard } from "@/components/Flow/FlashcardComponents/Flashcard";
import { MainStack } from "@/components/Flow/StackComponents/MainStack";
import { Stack } from "@/components/Flow/StackComponents/Stack";
import ReactFlow, { Background, Panel, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

// as reactflow is written in TS -> types don't have to be included separately

type NodeTypesType = {
  // any to bypass type checking
  [key: string]: React.ComponentType<any>;
};

const nodeTypes: NodeTypesType = {
  flashcard: Flashcard,
  stack: Stack,
  mainStack: MainStack,
};

const LoginBackground: React.FC = () => {
  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="flex flex-col justify-items-center"
    >
      <ReactFlow zoomOnPinch={false}>
        <Background />
        <Panel position="bottom-center" className="space-x-4" children={undefined}></Panel>
      </ReactFlow>
    </div>
  );
};

export default function LoginFlow() {
  return (
    <ReactFlowProvider>
      <LoginBackground />
    </ReactFlowProvider>
  );
}
