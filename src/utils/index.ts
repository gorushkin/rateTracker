import { User } from '../entity/user';

class LogLine {
  constructor(
    public id: number,
    public time: string,
    public message: string,
    public user: User,
  ) {}

  print = () => {
    return `${this.id}: ${this.user.username} ${this.time} - ${this.message}`;
  };
}

class Logger {
  logs: LogLine[] = [];
  id: number = 0;

  addLog = (message: string, user: User) => {
    const time = new Date().toUTCString();

    const newLine = new LogLine(this.id++, time, message, user);

    console.log(newLine.print());

    this.logs.push(newLine);
  };

  getLogs = () => {
    return this.logs;
  };

  printLogs = () => {
    const logs = this.logs.map((logLine) => logLine.print());

    console.log(logs.join('\n'));
  };
}

export const logger = new Logger();
