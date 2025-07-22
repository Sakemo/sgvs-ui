// src/components/common/DateFilterDropdown.tsx
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { LuCalendar, LuChevronDown } from 'react-icons/lu';
import Button from './ui/Button';
import clsx from 'clsx';

export type DateFilterOption = 'today' | 'this_month' | 'this_year' | 'all';

interface DateFilterDropdownProps {
  selectedOption: DateFilterOption;
  onSelect: (option: DateFilterOption) => void;
  options: { key: DateFilterOption; label: string }[];
}

const DateFilterDropdown: React.FC<DateFilterDropdownProps> = ({ selectedOption, onSelect, options }) => {
  const selectedLabel = options.find(opt => opt.key === selectedOption)?.label;

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div className="flex rounded-btn shadow-sm">
        <div className="relative flex-grow focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LuCalendar className="h-5 w-5 text-gray-300" />
          </div>
          <span className="block w-full h-10 pl-10 pr-3 sm:text-sm border border-border-light dark:border-border-dark rounded-l-md bg-card-light dark:bg-card-dark flex items-center">
            {selectedLabel}
          </span>
        </div>
        
        <Menu.Button as={Button} variant="secondary" className="rounded-l-none border-l-0 px-2">
          <LuChevronDown className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 w-full origin-top-left rounded-card bg-card-light dark:bg-card-dark shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-10">
          <div className="p-1">
            {options.map((option) => (
              <Menu.Item key={option.key}>
                {({ active }) => (
                  <button
                    onClick={() => onSelect(option.key)}
                    className={clsx(
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      active ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-primary dark:text-gray-200'
                    )}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DateFilterDropdown;