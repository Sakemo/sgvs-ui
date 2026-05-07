import { format, formatDistanceToNowStrict, isToday, isYesterday, isTomorrow, parseISO, type Locale } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import i18n from '../i18n';

export type ProfitMarginStatus = 'abusive' | 'healthy' | 'warning' | 'low' | 'loss' | 'no_cost' | 'zero';
export type BusinessField = 'COMMERCE' | 'INDUSTRY' | 'SERVICES' | 'OTHERS';

export interface ProfitMarginResult {
  percentage: number | null;
  formatted: string;
  status: ProfitMarginStatus;
}

const MARGIN_BENCHMARKS: Record<BusinessField, [number, number, number]> = {
  COMMERCE: [10, 20, 30],
  INDUSTRY: [8, 12, 25],
  SERVICES: [20, 30, 50],
  OTHERS: [15, 25, 40]
};

/**
 * Calculates the profit margin percentage for a product.
 * Formula: ((salePrice - costPrice) / costPrice) * 100
 * @param salePrice - The selling price of the product.
 * @param costPrice - The cost price of the product.
 * @returns An object with the calculated percentage, formatted string, and status.
 */
export const calculateProfitMargin = (
  salePrice: number | null | undefined,
  costPrice: number | null | undefined,
  businessField: BusinessField = 'COMMERCE'
): ProfitMarginResult => {
  if (costPrice === null || costPrice === undefined || costPrice <= 0 || salePrice === null || salePrice === undefined) {
    return { percentage: null, formatted: '-', status: 'no_cost' };
  }

  if (salePrice === null || salePrice == undefined || salePrice <= 0) {
    return { percentage: null, formatted: '-', status: 'zero' };
  }

  if (costPrice > salePrice) {
    const loss = salePrice - costPrice;
    const lossMargin = (loss / salePrice) * 100;
    return {
      percentage: lossMargin,
      formatted: `${lossMargin.toFixed(1)}%`,
      status: 'loss',
    };
  }

  const profit = salePrice - costPrice;
  const margin = (profit / salePrice) * 100;
  
  const [lowThreshold, healthyThreshold, abusiveThreshold] = MARGIN_BENCHMARKS[businessField] || MARGIN_BENCHMARKS.OTHERS;

  let status: ProfitMarginStatus;
  if (margin > abusiveThreshold) status = 'abusive';
  else if (margin >= healthyThreshold) status = 'healthy';
  else if (margin >= lowThreshold) status = 'warning';
  else status = 'low';

  return {
    percentage: margin,
    formatted: `${margin.toFixed(1)}%`,
    status: status,
  };
};

/**
 * Retorna o 'locale' do date-fns com base no idioma atual do i18n.
 * @returns {Locale} O objeto de locale para pt-BR ou en-US.
 */
const getCurrentLocale = (): Locale => {
  return i18n.language.startsWith('pt') ? ptBR : enUS;
};

/**
 * Formata um valor numérico como moeda, respeitando o idioma atual.
 * Suporta BRL para português e USD para inglês.
 * @param {number | null | undefined} value - O valor a ser formatado.
 * @returns {string} A string formatada, ex: "R$ 5,00" ou "$5.00".
 */
export const formatCurrency = (value: number | null | undefined): string => {
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
  const currency = i18n.language.startsWith('pt') ? 'BRL' : 'USD';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value ?? 0); // Usa '?? 0' como um fallback seguro para null/undefined
};

/**
 * Formata uma data (string ISO) de forma inteligente e traduzível.
 * - Se for hoje, retorna "Hoje, HH:mm".
 * - Se for ontem, retorna "Ontem, HH:mm".
 * - Caso contrário, retorna "dd/MM/yyyy, HH:mm".
 * @param {string | null | undefined} dateString - A data em formato string ISO.
 * @param {object} [options] - Opções de formatação.
 * @param {boolean} [options.showTime=true] - Se deve incluir o horário.
 * @returns {string} A data formatada e legível.
 */
export const formatDate = (
  dateString: string | null | undefined,
  options: { showTime?: boolean } = { showTime: true }
): string => {
  if (!dateString) {
    return i18n.t('formatters.invalidDate', 'Data inválida');
  }

  try {
    const date = parseISO(dateString);
    const locale = getCurrentLocale();
    const timeFormat = 'HH:mm';
    const dateFormatWithoutYear = locale === ptBR ? 'dd/MM' : 'MM/dd';

    let relativeDatePart: string;

    if (isToday(date)) {
      relativeDatePart = i18n.t('formatters.today', 'Hoje');
    } else if (isYesterday(date)) {
      relativeDatePart = i18n.t('formatters.yesterday', 'Ontem');
    } else if (isTomorrow(date)) {
      relativeDatePart = i18n.t('formatters.tomorrow', 'Amanhã');
    } else {
      relativeDatePart = format(date, dateFormatWithoutYear, { locale });
    }

    if (options.showTime) {
      const timePart = format(date, timeFormat, { locale });
      return `${relativeDatePart}, ${timePart}`;
    }

    return relativeDatePart;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return i18n.t('formatters.invalidDate', 'Data inválida');
  }
};


/**
 * Formata uma data para exibir há quanto tempo ela ocorreu (ex: "há 2 horas", "há 3 dias").
 * @param {string | null | undefined} dateString - A data em formato string ISO.
 * @returns {string} A string formatada.
 */
export const formatTimeAgo = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '—';
  }
  try {
    const date = parseISO(dateString);
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: getCurrentLocale() });
  } catch (error) {
    return i18n.t('formatters.invalidDate' + error, 'Data inválida');
  }
};

// =================================================================
// PHONE VALIDATION & FORMATTING
// =================================================================

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a phone number string.
 * - Allows: digits, parentheses, hyphens, plus sign, and spaces
 * - Requires: at least 10 digits for a valid phone number
 * 
 * @param {string | null | undefined} phone - The phone number to validate
 * @returns {PhoneValidationResult} Object with isValid flag and optional error message
 */
export const validatePhone = (phone: string | null | undefined): PhoneValidationResult => {
  if (!phone || phone.trim() === '') {
    // Empty phone is valid (it's optional)
    return { isValid: true };
  }

  const trimmedPhone = phone.trim();

  // Check if phone contains only allowed characters
  const allowedCharsRegex = /^[0-9()+\-\s]*$/;
  if (!allowedCharsRegex.test(trimmedPhone)) {
    return {
      isValid: false,
      error: i18n.t('validation.phoneInvalidCharacters', 'Telefone contém caracteres inválidos')
    };
  }

  // Extract only digits to check minimum length
  const digitsOnly = trimmedPhone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) {
    return {
      isValid: false,
      error: i18n.t('validation.phoneMinDigits', 'Telefone deve conter pelo menos 10 dígitos')
    };
  }

  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      error: i18n.t('validation.phoneMaxDigits', 'Telefone não pode ter mais de 15 dígitos')
    };
  }

  return { isValid: true };
};

/**
 * Sanitizes phone input by removing invalid characters and limiting to 15 digits
 * Only keeps: digits, parentheses, hyphens, plus sign, and spaces
 * 
 * @param {string} value - The raw phone input
 * @returns {string} Sanitized phone string with max 15 digits
 */
export const sanitizePhoneInput = (value: string): string => {
  const sanitized = value.replace(/[^0-9()+\-\s]/g, '');
  const digitsOnly = sanitized.replace(/\D/g, '');
  
  // If we exceed 15 digits, truncate to 15
  if (digitsOnly.length > 15) {
    // Find the position in the sanitized string and remove from there
    let digitCount = 0;
    let result = '';
    for (let i = 0; i < sanitized.length; i++) {
      if (/\d/.test(sanitized[i])) {
        if (digitCount < 15) {
          result += sanitized[i];
          digitCount++;
        }
      } else {
        // Only add non-digit characters if they come before the 15th digit
        if (digitCount < 15) {
          result += sanitized[i];
        }
      }
    }
    return result;
  }
  
  return sanitized;
};

/**
 * Formats a phone number automatically with DDD in parentheses
 * Converts: 1234567890 -> (12) 3456-7890
 * Converts: 12345678901 -> (12) 34567-8901
 * 
 * @param {string} value - The phone input
 * @returns {string} Formatted phone string
 */
export const formatPhoneAutomatically = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  
  // Don't format if less than 10 digits
  if (digitsOnly.length < 10) {
    return value;
  }
  
  // Format for 10 digits: (XX) XXXX-XXXX
  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // Format for 11 digits: (XX) XXXXX-XXXX
  if (digitsOnly.length === 11) {
    return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Format for 12-15 digits: (XX) XXXXXX-XXXX or more
  if (digitsOnly.length > 11) {
    const ddd = digitsOnly.substring(0, 2);
    const remaining = digitsOnly.substring(2);
    const middleLength = remaining.length - 4;
    const middle = remaining.substring(0, middleLength);
    const lastFour = remaining.substring(middleLength);
    return `(${ddd}) ${middle}-${lastFour}`;
  }
  
  return value;
};

/**
 * Formats a phone number for display
 * Supports Brazilian phone format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 * 
 * @param {string | null | undefined} phone - The phone number to format
 * @returns {string} Formatted phone number or original if format fails
 */
export const formatPhoneDisplay = (phone: string | null | undefined): string => {
  if (!phone) return '';

  const digitsOnly = phone.replace(/\D/g, '');

  // Brazilian phone format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  if (digitsOnly.length === 11) {
    return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  // Return original if doesn't match expected format
  return phone;
};
