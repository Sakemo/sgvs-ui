import React from 'react';
import clsx from 'clsx';

interface AdvancedOptionsProps {
    children: React.ReactNode;
    className?: string;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ children, className }) => {
    return (
        <div className={clsx(className)}>
            {children}
        </div>
    );
};
export default AdvancedOptions;
