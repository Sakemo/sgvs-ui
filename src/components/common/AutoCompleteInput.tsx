import type React from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Combobox, Transition } from "@headlessui/react";
import { LuCheck, LuChevronDown, LuPlus } from "react-icons/lu";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

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
  onCreateOption?: (query: string) => void | Promise<void>;
  getCreateOptionLabel?: (query: string) => string;
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
  isLoading?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

interface CreateAutocompleteOption extends AutocompleteOption {
  __autocompleteAction: "create";
  query: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  placeholder,
  options,
  selected,
  onSelect,
  onQueryChange,
  onCreateOption,
  getCreateOptionLabel,
  renderOption,
  isLoading = false,
  inputRef,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const trimmedQuery = query.trim();
  const hasExactMatch = options.some(
    (option) => option.label.trim().toLocaleLowerCase() === trimmedQuery.toLocaleLowerCase()
  );
  const shouldShowCreateOption = Boolean(
    onCreateOption && trimmedQuery && !hasExactMatch
  );
  const createOption: CreateAutocompleteOption | null = shouldShowCreateOption
    ? {
        value: `__create__${trimmedQuery}`,
        label: getCreateOptionLabel?.(trimmedQuery) ?? `${t("actions.create")} "${trimmedQuery}"`,
        __autocompleteAction: "create",
        query: trimmedQuery,
      }
    : null;

  useEffect(() => {
    onQueryChange(debouncedQuery);
  }, [debouncedQuery, onQueryChange]);

  const isCreateOption = (
    option: AutocompleteOption | CreateAutocompleteOption | null
  ): option is CreateAutocompleteOption =>
    Boolean(
      option &&
      "__autocompleteAction" in option &&
      option.__autocompleteAction === "create" &&
      typeof option.query === "string"
    );

  const handleChange = (option: AutocompleteOption | CreateAutocompleteOption | null) => {
    setQuery("");

    if (isCreateOption(option)) {
      void onCreateOption?.(option.query);
      return;
    }

    onSelect(option);
  };

  return (
    <Combobox value={selected} onChange={handleChange}>
      <div className="relative w-full">
        {label && (
          <Combobox.Label className="mb-1 block text-sm font-medium text-text-secondary">
            {label}
          </Combobox.Label>
        )}
        <div className="relative">
          <Combobox.Input
            ref={inputRef}
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
                    {t("common.loading")}
                    </div>}
                {!isLoading && options.length === 0 && query !== '' && !createOption ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-text-secondary">
                        {t("common.noResults")}
                    </div>
                ) : (
                    <>
                      {options.map((option) => (
                        <Combobox.Option
                          key={option.value}
                          className={({ active }) => clsx('relative cursor-default select-none py-2 px-4', active ? 'bg-brand-primary/10' : '')}
                          value={option}
                        >
                          {({ selected: isSelected }) =>
                            renderOption ? (
                              renderOption(option) as React.ReactElement
                            ) : (
                              <div className="flex items-center">
                                <span className={clsx("flex-shrink-0 w-5", isSelected ? 'opacity-100' : 'opacity-0')}>
                                  <LuCheck className="h-5 w-5 text-brand-primary" />
                                </span>
                                <span className={clsx('ml-2 block truncate', isSelected ? 'font-semibold' : 'font-normal')}>
                                  {option.label}
                                </span>
                              </div>
                            )
                          }
                        </Combobox.Option>
                      ))}
                      {createOption && (
                        <Combobox.Option
                          key={createOption.value}
                          className={({ active }) =>
                            clsx(
                              "relative cursor-default select-none py-2 px-4",
                              active ? "bg-brand-primary/10" : ""
                            )
                          }
                          value={createOption}
                        >
                          <div className="flex items-center text-brand-primary">
                            <span className="flex-shrink-0 w-5">
                              <LuPlus className="h-5 w-5" />
                            </span>
                            <span className="ml-2 block truncate font-medium">
                              {createOption.label}
                            </span>
                          </div>
                        </Combobox.Option>
                      )}
                    </>
                )}
            </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
export default AutocompleteInput;
