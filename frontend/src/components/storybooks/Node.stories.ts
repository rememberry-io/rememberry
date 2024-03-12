import type { Meta, StoryObj } from "@storybook/react";
import { NodeUI } from "../Flow/CardComponents/NodeUI";

const meta: Meta<typeof NodeUI> = {
  component: NodeUI,
};

export default meta;
type Story = StoryObj<typeof NodeUI>;

export const Primary: Story = {
  args: {
    isFront: true,
    frontside: "Front Text",
    backside: "Back Text",
    borderClasses: "border-2 border-white dark:border-dark-900",
    isFocused: false,
    normalizeZoom: (zoom: number) => zoom,
    zoom: 1,
    toggleCard: () => {},
    openDialog: () => {},
    handleColorChange: (color: string) => {},
    nodeType: "card",
    nodeId: "nodeId",
    blur: () => {},
  },
};
