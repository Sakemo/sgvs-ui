import type React from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Combobox, Transition } from "@headlessui/react";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import clsx from "clsx";

export interface AutocompleteOption {
  value: number | string;
  label: string;
  [key: string]: unknown;
}

interface AutocompleteInputProps {
  label: string;
  placeholder?: string;
  options: AutocompleteOption[];
  selected: AutocompleteOption | null;
  onSelect: (option: AutocompleteOption | null) => void;
  onQueryChange: (query: string) => void;
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
  isLoading?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  placeholder,
  options,
  selected,
  onSelect,
  onQueryChange,
  renderOption,
  isLoading = false,
}) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    onQueryChange(debouncedQuery);
  }, [debouncedQuery, onQueryChange]);

  return (
    <Combobox value={selected} onChange={onSelect}>
      <div className="relative w-full">
        {label && (
          <Combobox.Label className="mb-1 block text-sm font-medium text-text-secondary">
            {label}
          </Combobox.Label>
        )}
        <div className="relative">
          <Combobox.Input
            className="h-10 w-full rounded-input border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
            displayValue={(option: AutocompleteOption) => option?.label ?? ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            onFocus={() => {
              if (buttonRef.current) {
                buttonRef.current.click();
              }
            }}
          />
          <Combobox.Button ref={buttonRef} className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <LuChevronDown className="text-gray-400"/>
          </div>

        </div>
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-card-light dark:bg-card-dark py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                {isLoading && <div className="px-4 py-2 text-text-secondary">
                    Loading...
                    </div>}
                {!isLoading && options.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-text-secondary">
                        Nothing Found
                    </div>
                ) : (
                    options.map((option) => (
            <Combobox.Option
              key={option.value}
              className={({ active }) => clsx('relative cursor-default select-none py-2 px-4', active ? 'bg-brand-primary/10' : '')}
              value={option}
            >
              {() =>
                renderOption ? (
                  renderOption(option) as React.ReactElement
                ) : (
                  <div className="flex items-center">
                    <span className={clsx("flex-shrink-0 w-5", selected ? 'opacity-100' : 'opacity-0')}>
                      <LuCheck className="h-5 w-5 text-brand-primary" />
                    </span>
                    <span className={clsx('ml-2 block truncate', selected ? 'font-semibold' : 'font-normal')}>
                      {option.label}
                    </span>
                  </div>
                )
              }
            </Combobox.Option>
                    ))
                )}
            </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
export default AutocompleteInput;
