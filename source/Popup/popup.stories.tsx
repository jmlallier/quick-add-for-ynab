// YourComponent.stories.ts | YourComponent.stories.tsx

import React, { ComponentProps } from "react";

import { Story, Meta } from "@storybook/react";
import Popup from "./Popup";

//👇 This default export determines where your story goes in the story list
export default {
  title: "Transaction Popup",
  component: Popup,
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<ComponentProps<typeof Popup>> = (args: any) => (
  <Popup {...args} />
);

export const QuickAdd = Template.bind({});
QuickAdd.args = {
  /*👇 The args you need here will depend on your component */
};
