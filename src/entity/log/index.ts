import { User } from '../database';

class LogLine {
  constructor(
    public id: number,
    public time: string,
    public message: string,
    public user: User,
  ) {}
}

class Logger {
  logs: LogLine[] = [];
  id: number = 0;

  addLog = (message: string, user: User) => {
    const time = new Date().toUTCString();

    this.logs.push(new LogLine(this.id++, time, message, user));
  };

  getLogs = () => {
    return this.logs;
  };

  printLogs = () => {
    const logs = this.logs.map(
      ({ time, message, id }) => `${id}: ${time} - ${message}`,
    );

    console.log(logs.join('\n'));
  };
}

export const logger = new Logger();
