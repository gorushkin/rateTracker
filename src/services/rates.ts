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

    const rates = Object.entries(response.data).reduce<
      { currency: string; rate: number }[]
    >((acc, [currency, rate]) => {
      if (!this.currencies.includes(currency as Currency)) {
        return acc;
      }

      const item = {
        currency,
        rate: Number(rate.toFixed(2))
      };

      return [...acc, item];
    }, []);

    return rates;
  };
}


export const ratesService = new RatesService();
