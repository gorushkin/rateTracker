import { BotController } from '../../controllers';
import { errorHandler } from '../../utils/errors';
import { Command, Button } from '../../keyboards';
import { User } from '../../services/user';
import { UserAction } from '../../utils/context';

export enum ROUTE {
  GET_RATES = 'get_rates',
  SETTINGS = 'settings',
  SYSTEM_INFO = 'system_info',
  VIEW_LOGS = 'view_logs',
  MAIN_SCREEN = 'main_screen',
  SETTINGS_INFO = 'settings_info',
  SET_USER_UTC_OFFSET = 'set_user_utc_offset',
  HOURLY_UPDATES_SETTINGS = 'hourly_updates_settings',
  DAILY_UPDATES_SETTINGS = 'daily_updates_settings',
  DEFAULT = 'default',
}

export type Controller = (
  user: User,
  message?: string | undefined,
) => Promise<void>;

const compareCommand = (command: Command) => (text?: string) =>
  text === `/${command}`;

const CompareButton = (button: Button) => (text?: string) => text === button;

export const getRoute = (message?: string): ROUTE => {
  if (!message) {
    return ROUTE.DEFAULT;
  }

  const isCommandGetRates = compareCommand(Command.GET_RATES);
  const isCommandSettings = compareCommand(Command.SETTINGS);

  const isButtonGetRates = CompareButton(Button.GET_RATES);

  const isButtonSettings = CompareButton(Button.SETTINGS);

  const isButtonSystemInfo = CompareButton(Button.SYSTEM_INFO);

  const isButtonViewLogs = CompareButton(Button.VIEW_LOGS);

  const isButtonMainScreen = CompareButton(Button.MAIN_SCREEN);

  const isButtonTurnOnHourlyUpdates = CompareButton(
    Button.TURN_ON_HOURLY_UPDATES,
  );
  const isButtonTurnOffHourlyUpdates = CompareButton(
    Button.TURN_OFF_HOURLY_UPDATES,
  );

  const isButtonTurnOnDailyUpdates = CompareButton(
    Button.TURN_ON_DAILY_UPDATES,
  );
  const isButtonTurnOffDailyUpdates = CompareButton(
    Button.TURN_OFF_DAILY_UPDATES,
  );

  const isSettingsInfo = CompareButton(Button.SETTINGS_INFO);
  const isSettingUserUtcOffset = CompareButton(Button.SET_USER_UTC_OFFSET);

  const isRouteGetRates = (text?: string) =>
    isCommandGetRates(text) || isButtonGetRates(text);

  if (isRouteGetRates(message)) {
    return ROUTE.GET_RATES;
  }

  const isRouteSettings = (text?: string) =>
    isCommandSettings(text) || isButtonSettings(text);

  if (isRouteSettings(message)) {
    return ROUTE.SETTINGS;
  }

  const isRouteHourlyUpdatesSettings = (text?: string) =>
    isButtonTurnOffHourlyUpdates(text) || isButtonTurnOnHourlyUpdates(text);

  if (isRouteHourlyUpdatesSettings(message)) {
    return ROUTE.HOURLY_UPDATES_SETTINGS;
  }

  const isRouteDailyUpdatesSettings = (text?: string) =>
    isButtonTurnOnDailyUpdates(text) || isButtonTurnOffDailyUpdates(text);

  if (isRouteDailyUpdatesSettings(message)) {
    return ROUTE.DAILY_UPDATES_SETTINGS;
  }

  const isRouteSystemInfo = (text?: string) => isButtonSystemInfo(text);

  if (isRouteSystemInfo(message)) {
    return ROUTE.SYSTEM_INFO;
  }

  const isRouteViewLogs = (text?: string) => isButtonViewLogs(text);

  if (isRouteViewLogs(message)) {
    return ROUTE.VIEW_LOGS;
  }

  const isRouteMainScreen = (text?: string) => isButtonMainScreen(text);

  if (isRouteMainScreen(message)) {
    return ROUTE.MAIN_SCREEN;
  }

  const isRouteSettingsInfo = (text?: string) => isSettingsInfo(text);

  if (isRouteSettingsInfo(message)) {
    return ROUTE.SETTINGS_INFO;
  }

  const isSetUserUtcOffset = (text?: string) => isSettingUserUtcOffset(text);

  if (isSetUserUtcOffset(message)) {
    return ROUTE.SET_USER_UTC_OFFSET;
  }

  return ROUTE.DEFAULT;
};

export const validateTimeZone = (timeZone: string) => {
  const timeZoneRegex = /^([+-]?)([01]\d|2[0-3]):([0-5]\d)$/;
  return timeZoneRegex.test(timeZone);
};

export const timezoneToMinutes = (timeStr?: string): number => {
  if (!timeStr) {
    return 0;
  }

  const sign = timeStr.startsWith('-') ? -1 : 1;
  const [hours, minutes] = timeStr.replace('-', '').split(':').map(Number);
  return sign * (hours * 60 + minutes);
};

export const minutesToTimezone = (minutes: number): string => {
  const sign = minutes < 0 ? '-' : '+';
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const remainingMinutes = absMinutes % 60;
  return `${sign}${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
};

type RouteControllerMap = Record<ROUTE, Controller>;

export const getRouteController = (
  botController: BotController,
): ((message?: string) => Controller) => {
  const mapping: RouteControllerMap = {
    [ROUTE.GET_RATES]: botController.onGetRates,
    [ROUTE.SETTINGS]: botController.onSettings,
    [ROUTE.HOURLY_UPDATES_SETTINGS]: botController.onHourlyUpdatesSettings,
    [ROUTE.DAILY_UPDATES_SETTINGS]: botController.onDailyUpdatesSettings,
    [ROUTE.SETTINGS_INFO]: botController.onSettingsInfo,
    [ROUTE.SYSTEM_INFO]: botController.onSystemInfo,
    [ROUTE.VIEW_LOGS]: botController.onViewLogs,
    [ROUTE.MAIN_SCREEN]: botController.onGetRates,
    [ROUTE.SET_USER_UTC_OFFSET]: botController.showSettingUtcOffset,
    [ROUTE.DEFAULT]: botController.defaultResponse,
  };

  return (message?: string) => {
    const route = getRoute(message);
    return mapping[route];
  };
};

type ActionControllerMap = Record<UserAction, Controller>;

export const getActionController = (
  botController: BotController,
): ((action: UserAction) => Controller) => {
  const mapping: ActionControllerMap = {
    [UserAction.SET_USER_UTC_OFFSET]: (user: User, message?: string) =>
      errorHandler(botController.setUtcOffset(user, message)),
  };

  return (action: UserAction) => mapping[action];
};
