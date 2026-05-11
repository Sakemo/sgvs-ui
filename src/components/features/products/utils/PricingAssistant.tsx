// src/components/features/products/utils/PricingAssistant.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuInfo, LuThumbsUp, LuTriangleAlert, LuBadgePercent } from 'react-icons/lu';
import { type ProfitMarginStatus } from '../../../../utils/formatters';
import Card from '../../../common/ui/Card';

interface PricingAssistantProps {
  status: ProfitMarginStatus;
}

const assistantConfig = {
  abusive: { Icon: LuTriangleAlert, color: 'text-[#012F22] dark:text-[#DCE8D4]' },
  healthy: { Icon: LuThumbsUp, color: 'text-brand-primary' },
  warning: { Icon: LuInfo, color: 'text-brand-accent dark:text-brand-secondary-accent' },
  low: { Icon: LuTriangleAlert, color: 'text-[#4F6F45] dark:text-[#B9D8B4]' },
  loss: { Icon: LuTriangleAlert, color: 'text-red-500' },
  no_cost: { Icon: LuBadgePercent, color: 'text-[#8A817B]' },
  zero: { Icon: LuBadgePercent, color: 'text-[#8A817B]' },
};

const PricingAssistant: React.FC<PricingAssistantProps> = ({ status }) => {
  const { t } = useTranslation();

  if (status === 'no_cost' || status === 'zero') {
    return null;
  }

  const { Icon, color } = assistantConfig[status];
  
  const messageKey = `product.assistant.${status}`;
  const defaultMessage = `Default message for ${status}`;

  return (
    <Card className="!bg-transparent border-0 p-0 shadow-none">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <div>
          <h4 className="text-sm font-semibold text-text-primary dark:text-[#F7F1ED]">
            {t('product.assistant.title', 'Assistant Insights')}
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            {t(messageKey, defaultMessage)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PricingAssistant;
