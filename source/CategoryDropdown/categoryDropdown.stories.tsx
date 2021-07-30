import React, { ComponentProps } from "react";

import { Story, Meta } from "@storybook/react";
import CategoryDropdown from "./CategoryDropdown";

//👇 This default export determines where your story goes in the story list
export default {
  title: "Category Dropdown",
  component: CategoryDropdown,
} as Meta;

//👇 We create a “template” of how args map to rendering
const Template: Story<ComponentProps<typeof CategoryDropdown>> = (
  args: any
) => {
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
      <CategoryDropdown {...args} onSelectedItemChange={onSelectedItemChange} />
    </div>
  );
};

export const CategoryInput = Template.bind({});
CategoryInput.args = {
  items: [
    {
      id: "1",
      name: "Category 1",
    },
    {
      id: "2",
      name: "Category 2",
    },
    {
      id: "3",

      name: "Category 3",
    },
  ],
  /*👇 The args you need here will depend on your component */
};
