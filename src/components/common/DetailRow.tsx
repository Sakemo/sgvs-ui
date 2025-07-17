import type React from "react";

export const DetailRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label, value
}) => (
    <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-text-secondary">
            {label}
        </dt>
        <dd className="mt-1 text-sm text text-primary dark:text-gray-100 sm:mt-0 sm:col-span-2">
            {value ?? <span className="italic text-text-secondary/70">Not Provided</span>}
        </dd>
    </div>
);