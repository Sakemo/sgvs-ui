import type { ProfitMarginStatus } from "../../../../utils/formatters";

export const marginBadgeColors: Record<ProfitMarginStatus, 'green' | 'yellow' | 'blue' | 'red' | 'gray'> = {
  high: 'green',
  medium: 'blue',
  low: 'yellow',
  loss: 'red',
  'n/a': 'gray',
};