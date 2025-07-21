import clsx from "clsx";
import type React from "react";

interface OptionCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon: Icon, title, description, isSelected, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      'w-full text-left p-4 rounded-card border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-accent',
      isSelected
        ? 'bg-brand-primary/10 border-brand-primary shadow-soft'
        : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark hover:border-brand-primary/50 dark:hover:border-brand-accent/50',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    )}
  >
    <div className="flex items-start gap-4">
      <Icon className={clsx("h-6 w-6 flex-shrink-0 mt-0.5", isSelected ? "text-brand-primary" : "text-text-secondary")} />
      <div>
        <h3 className="font-semibold text-text-primary dark:text-white">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  </button>
);
export default OptionCard;