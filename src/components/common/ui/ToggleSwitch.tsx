import { Switch } from "@headlessui/react";
import clsx from "clsx";
import type React from "react";

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    enabled, onChange, label
}) => {
    return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={onChange}
        className={clsx(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-bg-dark',
          enabled ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </Switch>
      {label && (
        <Switch.Label as="span" className="ml-3 text-sm">
          <span className="font-medium text-text-primary dark:text-gray-200">{label}</span>
        </Switch.Label>
      )}
    </Switch.Group>
    )
}

export default ToggleSwitch;