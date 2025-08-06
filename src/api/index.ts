import axios from 'axios';
import { config } from '../config';

export type HistoryRate = { date: string; rate: number };

export type HistoryData = Record<string, HistoryRate[]>;

const url = `${config.API_URL}/currency-rates/rates`;

export type Response<T> = { ok: true; data: T } | { ok: false; error: string };

export const getRates = async (): Promise<Response<HistoryData>> => {
  try {
    const { data } = await axios.get<HistoryData>(url);

    return { ok: true, data };
  } catch (error) {
    console.error('Error fetching rates');
    return { ok: false, error: 'Something went wrong' };
  }
};
