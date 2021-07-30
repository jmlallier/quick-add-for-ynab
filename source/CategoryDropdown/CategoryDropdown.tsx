import React, { useState } from "react";
import { useCombobox } from "downshift";
import { Category } from "../Popup/Popup";

function stateReducer(state: any, actionAndChanges: any) {
  const { type, changes } = actionAndChanges;
  // this prevents the menu from being closed when the user selects an item with 'Enter' or mouse
  switch (type) {
    case useCombobox.stateChangeTypes.ItemClick:
    case useCombobox.stateChangeTypes.FunctionSelectItem:
      return {
        ...changes,
        inputValue: changes.selectedItem.name,
      };
    default:
      return changes; // otherwise business as usual.
  }
}

export default function CategoryDropdown({
  items,
  label,
  disabled = false,
  onSelectedItemChange = (item) => item,
}: {
  items: Category[];
  label: string;
  disabled?: boolean;
  onSelectedItemChange?: (item: any) => void;
}) {
  const [inputItems, setInputItems] = useState(items);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue = "" }) => {
      setInputItems(
        items.filter((item) =>
          item.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    },
    stateReducer,
    onSelectedItemChange,
  });
  const labelClassName = "block text-sm font-medium text-gray-700";
  const comboboxClassName = "mt-1 relative flex";
  const inputClassName =
    "relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const menuClassName = `absolute z-10 mt-3 w-full bg-white shadow-lg max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm transition ease-in duration-100 ${
    isOpen && inputItems.length ? "opacity-100" : "opacity-0"
  }`;
  const toggleButtonClassName =
    "bg-white border border-gray-300 rounded-md shadow-sm ml-3 px-3";
  const itemClassName =
    "text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 cursor-pointer";

  return (
    <div className="relative">
      <label className={labelClassName} {...getLabelProps()}>
        {label}
      </label>
      <div className={comboboxClassName} {...getComboboxProps()}>
        <input
          className={inputClassName}
          placeholder="Category"
          {...getInputProps({ disabled })}
        />
        <button
          className={toggleButtonClassName}
          type="button"
          {...getToggleButtonProps()}
          aria-label="toggle menu"
        >
          &#8595;
        </button>
      </div>
      <ul className={menuClassName} {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              className={itemClassName}
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${item.id}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
