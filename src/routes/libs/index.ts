import { Command, Button } from '../../keyboards';

const compareCommand = (command: Command) => (text?: string) =>
  text === `/${command}`;

const isCommandGetRates = compareCommand(Command.GET_RATES);
const isCommandSettings = compareCommand(Command.SETTINGS);

const CompareButton = (button: Button) => (text?: string) => text === button;

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

const isButtonTurnOnDailyUpdates = CompareButton(Button.TURN_ON_DAILY_UPDATES);
const isButtonTurnOffDailyUpdates = CompareButton(
  Button.TURN_OFF_DAILY_UPDATES,
);

const isSettingsInfo = CompareButton(Button.SETTINGS_INFO);

const isRouteGetRates = (text?: string) =>
  isCommandGetRates(text) || isButtonGetRates(text);

const isRouteSettings = (text?: string) =>
  isCommandSettings(text) || isButtonSettings(text);

const isRouteHourlyUpdatesSettings = (text?: string) =>
  isButtonTurnOffHourlyUpdates(text) || isButtonTurnOnHourlyUpdates(text);

const isRouteDailyUpdatesSettings = (text?: string) =>
  isButtonTurnOnDailyUpdates(text) || isButtonTurnOffDailyUpdates(text);

const isRouteSystemInfo = (text?: string) => isButtonSystemInfo(text);

const isRouteViewLogs = (text?: string) => isButtonViewLogs(text);

const isRouteMainScreen = (text?: string) => isButtonMainScreen(text);

const isRouteSettingsInfo = (text?: string) => isSettingsInfo(text);

export const checkRoute = {
  isRouteGetRates,
  isRouteSettings,
  isRouteSystemInfo,
  isRouteViewLogs,
  isRouteMainScreen,
  isRouteHourlyUpdatesSettings,
  isRouteDailyUpdatesSettings,
  isRouteSettingsInfo,
};
