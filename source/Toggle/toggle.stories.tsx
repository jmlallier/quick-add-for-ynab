import React, { ComponentProps, useState } from "react";

import { Story, Meta } from "@storybook/react";
import { useArgs } from "@storybook/client-api";
import Toggle from "./Toggle";

//👇 This default export determines where your story goes in the story list
export default {
  title: "Toggle",
  component: Toggle,
} as Meta;

export const toggleExample = () => {
  const [toggled, setToggled] = useState(false);
  const onToggle = setToggled;
  const label = (enabled: boolean) => (enabled ? "Enabled" : "Disabled");
  const args = { label, onToggle };
  return (
    <div>
      <Toggle {...args} />
      Toggle state: {toggled ? "ON" : "OFF"}
    </div>
  );
};
