import type { ProfitMarginStatus } from "../../../../utils/formatters";

export const marginBadgeColors: Record<ProfitMarginStatus, 'purple' | 'green' | 'yellow' | 'orange' | 'blue' | 'red' | 'gray'> = {
  abusive: 'purple',
  healthy: 'green',
  warning: 'yellow',
  low: 'orange',
  loss: 'red',
  no_cost: 'gray',
  zero: 'gray',
};