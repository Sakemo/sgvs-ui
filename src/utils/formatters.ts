import { format, formatDistanceToNowStrict, isToday, isYesterday, parseISO, type Locale } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import i18n from '../i18n';

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
    const dateFormat = locale === ptBR ? 'dd/MM/yyyy' : 'MM/dd/yyyy';

    let relativeDatePart: string;

    if (isToday(date)) {
      relativeDatePart = i18n.t('formatters.today', 'Hoje');
    } else if (isYesterday(date)) {
      relativeDatePart = i18n.t('formatters.yesterday', 'Ontem');
    } else {
      relativeDatePart = format(date, dateFormat, { locale });
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