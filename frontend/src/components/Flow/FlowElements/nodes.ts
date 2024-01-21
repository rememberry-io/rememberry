import { Node } from "reactflow";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "stack",
    position: { x: 300, y: 100 },
    data: {
      frontText: "Cellular structure",
      backText:
        "biology branch that studies the structure, function, and behaviour of cells -> all living organisms are made of cells",
    },
  },
  
  {
    id: "2",
    type: "flashcard",
    position: { x: 600, y: 200 },
    data: {
      frontText: "What is your name?",
      backText: "Slim shady",
      category: "#1 - Cellular Structure",
      borderColor: "red"
    },
  },
  {
    id: "3",
    type: "stack",
    position: { x: 600, y: 100 },
    data: {
      frontText: "Cellular structure",
      backText: "Cellular structurefsefe",
    },
  },
  {
    id: "4",
    type: "stack",
    position: { x: 900, y: 100 },
    data: {
      frontText: "Cellular structure",
      backText: "Cellular structurefefe",
    },
  },
  {
    id: "5",
    type: "flashcard",
    position: { x: 900, y: 200 },
    data: {
      frontText: "Explain the role of the cytoskeleton",
      backText:
        "Set a value as an array and Motion will animate through each of these values in turn. By default, each keyframe will be spaced evenly throughout the animation, but the exact timing and easing can be configured via the transition property turn. By default, each keyframe will be spaced evenly throughout the animation, but the exact timing and easing can be configured via the transition property.",
      category: "#27 - Cellular Structure",
    },
  },
];

export default initialNodes;
