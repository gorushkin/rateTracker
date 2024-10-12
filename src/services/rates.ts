import { getRates, HistoryRate } from '../api';

enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  NZD = 'NZD',
  TRY = 'TRY',
  CNY = 'CNY',
}

const getIcon = (a: number) => (a > 0 ? '🔺' : '🔻');

const getDiffInfo = (
  current: number | undefined,
  prev: number | undefined,
  diffType: 'h' | 'd',
) => {
  if (!prev || !current) {
    return '';
  }

  const diff = current - prev;

  return `${diffType}: ${getIcon(diff)} ${diff.toFixed(2).padStart(5, ' ')};`;
};

class RatesService {
  ratesApi = getRates;

  currencies = Object.values(Currency);

  fetchRates = async () => {
    const response = await this.ratesApi();

    if (!response.ok) {
      throw new Error(response.error);
    }

    const result = this.currencies.reduce<string[]>((acc, currency) => {
      const rates = response.data[currency] ?? [];

      const lastHour = rates[0] as HistoryRate | undefined;
      const prevHour = rates[1] as HistoryRate | undefined;
      const prevDay = rates[24] as HistoryRate | undefined;

      const lastHourInfo = lastHour
        ? `${lastHour.rate.toFixed(2).padStart(6, ' ')}`
        : 'No data';
      const currencyData = `${currency.padEnd(4, ' ')}: ${lastHourInfo}`;
      const hourInfo = getDiffInfo(lastHour?.rate, prevHour?.rate, 'h');
      const dayInfo = getDiffInfo(lastHour?.rate, prevDay?.rate, 'd');

      const string = `${currencyData} ${hourInfo} ${dayInfo}`;

      return [...acc, string];
    }, []);

    return result.join('\n');
  };
}

export const ratesService = new RatesService();
