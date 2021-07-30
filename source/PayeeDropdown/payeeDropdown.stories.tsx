import React, { ComponentProps } from "react";

import { Story, Meta } from "@storybook/react";
import PayeeDropdown from "./PayeeDropdown";

//👇 This default export determines where your story goes in the story list
export default {
  title: "Payee Dropdown",
  component: PayeeDropdown,
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<ComponentProps<typeof PayeeDropdown>> = (args: any) => {
  const [selectedItem, setSelectedItem] = React.useState({
    id: null,
    name: null,
  });
  const onSelectedItemChange = (changes) => {
    setSelectedItem(changes.selectedItem);
    return changes;
  };
  return (
    <div>
      <div>
        Selected Item:{" "}
        {selectedItem.id
          ? `{ id: ${selectedItem.id}, name: '${selectedItem.name}'}`
          : "none"}
      </div>
      <PayeeDropdown {...args} onSelectedItemChange={onSelectedItemChange} />
    </div>
  );
};

export const PayeeInput = Template.bind({});
PayeeInput.args = {
  items: [
    {
      id: "1",
      name: "Payee 1",
    },
    {
      id: "2",
      name: "Payee 2",
    },
    {
      id: "3",

      name: "Payee 3",
    },
  ],
  /*👇 The args you need here will depend on your component */
};
