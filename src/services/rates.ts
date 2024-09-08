import { getRates } from '../api';

enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  NZD = 'NZD',
  TRY = 'TRY',
  CNY = 'CNY',
}

class RatesService {
  ratesApi = getRates;

  currencies = Object.values(Currency);

  fetchRates = async () => {
    const response = await this.ratesApi();

    if (!response.ok) {
      throw new Error(response.error);
    }

    const rates = this.currencies.reduce<{ currency: string; rate: string }[]>(
      (acc, currency) => {
        const rate = response.data[currency].toFixed(2);

        const item = {
          currency,
          rate,
        };

        return [...acc, item];
      },
      [],
    );

    return rates;
  };
}

export const ratesService = new RatesService();
