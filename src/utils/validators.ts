import { ApiError, AuthenticationError, ValidationError } from './errors';
import { Response } from '../api';
import { User } from '../services/user';

export const validateTimeZone = (timeZone: string) => {
  const regex = /^-?\d+$/;
  return regex.test(timeZone);
};

export const validateUtcOffsetValue = (message?: string) => {
  const isTimeZoneValid = validateTimeZone(message ?? '');

  if (!isTimeZoneValid) {
    throw new ValidationError('Invalid timezone offset');
  }
};

export function validateApiResponse<T>(
  response: Response<T>,
): asserts response is Response<T> {
  if (!response) {
    throw new ApiError('There is no connection to the server');
  }
}

export function validateUser(user: User | null): asserts user is User {
  if (!user) {
    throw new AuthenticationError('User not found');
  }
}
