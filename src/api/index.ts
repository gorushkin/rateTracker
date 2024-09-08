import axios from 'axios';

type Rates = Record<string, number>;

type RatesInfo = {
  rates: Rates;
  base: string;
};

const url = 'http://46.19.64.117/currency-rates/oer';

export type Response<T> = { ok: true; data: T } | { ok: false; error: string };

export const getRates = async (): Promise<Response<Rates>> => {
  try {
    const response = await axios.get<RatesInfo>(url);

    return { ok: true, data: response.data.rates };
  } catch (error) {
    console.error('Error fetching rates', error);
    return { ok: false, error: 'Something went wrong' };
  }
};
