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
  abusive: { Icon: LuTriangleAlert, color: 'text-purple-500' },
  healthy: { Icon: LuThumbsUp, color: 'text-green-500' },
  warning: { Icon: LuInfo, color: 'text-yellow-500' },
  low: { Icon: LuTriangleAlert, color: 'text-orange-500' },
  loss: { Icon: LuTriangleAlert, color: 'text-red-500' },
  no_cost: { Icon: LuBadgePercent, color: 'text-gray-500' },
  zero: { Icon: LuBadgePercent, color: 'text-gray-500' },
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
    <Card className="p-3 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
        <div>
          <h4 className="text-sm font-semibold text-text-primary dark:text-gray-200">
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