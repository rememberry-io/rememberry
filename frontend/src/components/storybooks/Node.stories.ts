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
    frontText: "Front Text",
    backText: "Back Text",
    borderClasses: "border-2 border-white dark:border-dark-900",
    isDialogOpen: false,
    isFocused: false,
    normalizeZoom: (zoom: number) => zoom,
    zoom: 1,
    toggleCard: () => {},
    openDialog: () => {},
    closeDialog: () => {},
    handleDialogSubmit: (front: string, back: string, parentName: string) => {},
    handleColorChange: (color: string) => {},
    cardType: "card",
    parentName: "Parent Name",
    nodeId: "nodeId",
    blur: () => {},
  },
};
