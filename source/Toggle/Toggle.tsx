import { useState } from "react";
import { Switch } from "@headlessui/react";
import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const defaultProps = {
  label: () => "",
};
type ToggleProps = {
  label: (enabled: boolean) => string;
  onToggle: (enabled: boolean) => void;
  [key: string]: any;
};
export default function Toggle({
  label = defaultProps.label,
  ...props
}: ToggleProps) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col">
      <Switch
        {...props}
        checked={enabled}
        onChange={(value) => {
          setEnabled(value);
          if (props.onToggle) {
            props.onToggle(value);
          }
        }}
        className={classNames(
          enabled
            ? "bg-green-600 focus:ring-green-500"
            : "bg-red-600 focus:ring-red-500",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        >
          <span
            className={classNames(
              enabled
                ? "opacity-0 ease-out duration-100"
                : "opacity-100 ease-in duration-200",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <span className="text-red-600">-</span>
            {/* <svg
            className="w-3 h-3 text-red-400"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          </span>
          <span
            className={classNames(
              enabled
                ? "opacity-100 ease-in duration-200"
                : "opacity-0 ease-out duration-100",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <span className="text-green-600">+</span>
            {/* <svg
            className="w-3 h-3 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 12 12"
          >
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg> */}
          </span>
        </span>
      </Switch>
      {label && <span>{label(enabled)}</span>}
    </div>
  );
}