export enum UserAction {
  SET_USER_UTC_OFFSET = 'SET_USER_UTC_OFFSET',
}

class Context {
  data = new Map<bigint, UserAction>();

  private setAction = (key: bigint, action: UserAction) => {
    this.data.set(key, action);
  };

  getAction = (key: bigint) => {
    const action = this.data.get(key);
    this.deleteAction(key);
    return action;
  };

  private deleteAction = (key: bigint) => {
    this.data.delete(key);
  };

  setUserUtcOffset = (key: bigint) => {
    this.setAction(key, UserAction.SET_USER_UTC_OFFSET);
  };
}

export const context = new Context();
