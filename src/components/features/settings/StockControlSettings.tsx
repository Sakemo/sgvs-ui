import type React from "react";
import { StockControlType } from "../../../api/types/domain";
import OptionCard from "../../common/OptionCard";
import Card from "../../common/ui/Card";
import { LuPackage, LuPackageX, LuWarehouse } from "react-icons/lu";
import { useTranslation } from "react-i18next";

interface StockControlSettingsProps {
    currentSelection: StockControlType;
    onChange: (value: StockControlType) => void;
    disabled?: boolean;
}

const StockControlSettings: React.FC<StockControlSettingsProps> = ({ currentSelection, onChange, disabled }) => {
  const { t } = useTranslation();

  const options = [
    {
      value: StockControlType.GLOBAL,
      icon: LuWarehouse,
      title: t('settings.stock.globalTitle', 'Global Control'),
      description: t('settings.stock.globalDesc', 'Validate and decrement stock for all products during every sale.'),
    },
    {
      value: StockControlType.PER_ITEM,
      icon: LuPackage,
      title: t('settings.stock.perItemTitle', 'Per-Item Control'),
      description: t('settings.stock.perItemDesc', 'Manage stock individually. Only products with stock control enabled will be validated.'),
    },
    {
      value: StockControlType.NONE,
      icon: LuPackageX,
      title: t('settings.stock.noneTitle', 'No Control'),
      description: t('settings.stock.noneDesc', 'Stock validation is completely disabled. Stock levels will not be updated.'),
    },
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">{t('settings.stock.title', 'Stock Management')}</h2>
      <div className="space-y-3">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            isSelected={currentSelection === option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
          />
        ))}
      </div>
    </Card>
  );
};

export default StockControlSettings;