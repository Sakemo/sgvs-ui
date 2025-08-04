import React from "react";
import clsx from 'clsx';

interface DetailRowProps {
    label: string;
    value?: React.ReactNode;
    className?: string;
    valueClassName?: string;
}

export const DetailRow: React.FC<DetailRowProps> = ({
    label, value, className, valueClassName
}) => (
    <div className={clsx("py-2.5 sm:grid sm:grid-cols-3 sm:gap-4", className)}>
        <dt className="text-sm font-medium text-text-secondary">
            {label}
        </dt>
        <dd className={clsx("mt-1 text-sm text-text-primary dark:text-gray-100 sm:mt-0 sm:col-span-2", valueClassName)}>
            {value ?? <span className="italic text-text-secondary/70">Not Provided</span>}
        </dd>
    </div>
);