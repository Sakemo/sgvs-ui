import type React from "react";
import { Fragment, useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Combobox, Transition } from "@headlessui/react";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import clsx from "clsx";

export interface AutocompleteOption {
  value: number | string;
  label: string;
}

interface AutocompleteInputProps {
  label: string;
  placeholder?: string;
  options: AutocompleteOption[];
  selected: AutocompleteOption | null;
  onSelect: (option: AutocompleteOption | null) => void;
  onQueryChange: (query: string) => void;
  isLoading?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  placeholder,
  options,
  selected,
  onSelect,
  onQueryChange,
  isLoading = false,
}) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

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
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
            <LuChevronDown className="text-gray-400"/>
          </Combobox.Button>
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
                            className={({ active }) => clsx('relative cursor-default select-none py-2 pl-10 pr-4', active ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-primary dark:text-gray-200')}
                            value={option}
                            >
                                {({ selected }) => (
                                    <>
                                    <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                                        {option.label}
                                    </span>
                                    {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-primary">
                                            <LuCheck />
                                        </span>
                                    ) : null}
                                    </>
                                )}
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
