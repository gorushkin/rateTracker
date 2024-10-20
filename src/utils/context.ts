export enum UserAction {
  SET_USER_UTC_OFFSET = 'SET_USER_UTC_OFFSET',
  SAVE_USER_UTC_OFFSET = 'SAVE_USER_UTC_OFFSET',
  REGISTER = 'REGISTER',
  GETTING_RATES = 'GETTING_RATES',
  DEFAULT = 'DEFAULT',
  START = 'START',
  SYSTEM_INFO = 'SYSTEM_INFO',
}

class Context {
  data = new Map<number, UserAction>();

  private isDebug = false;

  setAction = (key: number, action: UserAction) => {
    this.data.set(key, action);
    this.debug();
  };

  getAction = (key: number) => {
    const action = this.data.get(key);
    this.deleteAction(key);
    this.debug();
    return action;
  };

   deleteAction = (key: number) => {
    this.data.delete(key);
  };

  saveUserUtcOffset = (key: number) => {
    this.setAction(key, UserAction.SAVE_USER_UTC_OFFSET);
  };

  setGettingRates = (key: number) => {
    this.setAction(key, UserAction.GETTING_RATES);
  };

  private debug = () => {
    if (!this.isDebug) {
      return;
    }

    const userActions = Array.from(this.data)
      .map(([key, value]) => `user: ${key}, action: ${value}`)
      .join('\n');

    if (!userActions) {
      return;
    }

    console.log(userActions);
  };
}

export const context = new Context();
