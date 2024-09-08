import axios from 'axios';

enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  NZD = 'NZD',
  TRY = 'TRY',
  CNY = 'CNY',
  RUB = 'RUB',
}

export type Rates = Record<Currency, string>;

const getApiUrl = (currency: Currency, baseCurrency: Currency = Currency.RUB) =>
  `https://api.coingate.com/v2/rates/merchant/${currency}/${baseCurrency}`;

export const getCurrencyRate = async (currency: Currency): Promise<string> => {
  try {
    const { data } = await axios(getApiUrl(currency));
    return data;
  } catch (error) {
    console.error('error: ', error);
    return 'null';
  }
};

const currencies = [
  Currency.USD,
  Currency.EUR,
  Currency.CNY,
  Currency.NZD,
  Currency.TRY,
];

export const getRates = async () => {
  const promises = currencies.map(async (currency) => {
    const rate = await getCurrencyRate(currency);

    return { rate, currency };
  });

  return await Promise.all(promises);
};
