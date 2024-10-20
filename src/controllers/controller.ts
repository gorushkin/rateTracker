import { minutesToTimezone } from '../routes/libs';
import { ratesService } from '../services/rates';
import { User } from '../services/user';
import { userService } from '../services/users';
import { context } from '../utils/context';
import { validateUser, validateUtcOffsetValue } from '../utils/validators';

export type ControllerPayload = {
  id: number;
  username: string;
  data?: string;
};

export type ControllerFunction = (props: ControllerPayload) => Promise<string>;

export class Controller {
  private context = context;
  private userService = userService;

  setUserUtcOffset = async (props: ControllerPayload): Promise<string> => {
    this.context.saveUserUtcOffset(props.id);

    return 'Set your timezone offset';
  };

  saveUserUtcOffset = async ({ data }: ControllerPayload): Promise<string> => {
    validateUtcOffsetValue(data);

    const utcOffset = parseInt(data as string, 10);

    const timeZone = minutesToTimezone(utcOffset);

    return `Your timezone has been set to ${timeZone}`;
  };

  getUser = async (id: number): Promise<User> => {
    const user = await this.userService.getUser(id);
    validateUser(user);

    return user;
  };

  start = async (_: ControllerPayload): Promise<string> => {
    return 'Welcome to the currency rates bot';
  };

  getRates = async ({ id }: ControllerPayload): Promise<string> => {
    const user = await this.getUser(id);

    const userDate = user.getUserDate();

    const ratesString = await ratesService.fetchRates();

    return `Rates at ${userDate}:\n\n\`${ratesString}\``;
  };

  registerUser = async (props: ControllerPayload): Promise<string> => {
    const { id, username } = props;
    const user = await this.userService.addUser(id, username);

    return `You have been registered as ${user}`;
  };

  defaultReply = async (props: ControllerPayload) => {
    const { id } = props;
    await this.getUser(id);

    return 'I did not get you!!!';
  };
}
