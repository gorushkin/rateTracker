import axios from 'axios';
import { config } from '../config';

type Rates = Record<string, number>;

type RatesInfo = {
  rates: Rates;
  base: string;
  date: string;
};

const url = `${config.API_URL}/currency-rates/oer`;

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
