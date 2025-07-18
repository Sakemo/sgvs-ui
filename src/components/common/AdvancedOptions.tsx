import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown } from 'react-icons/lu';
import clsx from 'clsx';

interface AdvancedOptionsProps {
    children: React.ReactNode;
    className?: string;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ children, className }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="pt-4 border-t border-border-light dark:border-border-dark">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center justify-between w-full text-sm font-medium text-text-secondary hover:text-text-primary dark:hover:text-white"
            >
                <span>{t('actions.advancedOptions', 'Advanced Options')}</span>
                <LuChevronDown className={clsx("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            
            <div className={clsx(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}>
                <div className="overflow-hidden">
                    <div className={clsx("mt-4", className)}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdvancedOptions;