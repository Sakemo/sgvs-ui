import clsx from "clsx";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

interface AdvancedOptionsProps {
    children: React.ReactNode;
    className?: string;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ children, className }) =>
{
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState<number | "auto">(0);
    const innerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (isOpen && innerRef.current) {
            setHeight(innerRef.current.scrollHeight);
        } else if (!isOpen){
            setHeight(0);
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if(isOpen) setHeight("auto");
    };

    return (
        <div className="pt-4 border-t border-border-light dark:border-border-dark">
            <button
                type="button"
                onClick={() => {
                    if(!isOpen && innerRef.current) {
                        setHeight(innerRef.current.scrollHeight);
                        setIsOpen(true);
                    } else if (isOpen && innerRef.current){
                        const currentHeight = innerRef.current.offsetHeight;
                        setHeight(currentHeight);
                        setTimeout(() => setIsOpen(false), 10);
                    }
                }}
                className="flex items-center justify-between w-full text-sm font-medium text-text-secondary hover:text-text-primary dark:hover:text-white"
            >
                <span>
                    {t('actions.advancedOptions', 'Advanced Options')}
                </span>
                {isOpen ? <LuChevronUp className="h-4 w-4" /> : <LuChevronDown className="h-4 w-4" />}
            </button>
            
            <div
                style={{ height: height === "auto" ? "auto" : `${height}px` }}
                onTransitionEnd={handleTransitionEnd}
                className="transition-all duration-300 ease-in-out overflow-hidden"
            >
                <div ref={innerRef} className={clsx("mt-4 transition-all duration-300 ease-in-out", className)}>
                    {children}
                </div>
            </div>
        </div>
    );
};
export default AdvancedOptions;