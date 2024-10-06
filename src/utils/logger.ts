import { config } from '../config';
import fs from 'fs/promises';
import { getCurrentDateTime } from './dates';

class Line {
  private date: string;
  constructor(
    private type: string,
    private message: string,
  ) {
    this.date = getCurrentDateTime();
    this.print();
  }

  toString() {
    return `[${this.type}] ${this.date} ${this.message}`;
  }

  print() {
    console.log(this.toString());
  }
}

class Logger {
  private lines: Line[] = [];
  url: string | undefined = config.LOG_URL;

  setUrl = (url: string) => {
    this.url = url;
  };

  getLastLogs = () => {
    const lastLogs = this.lines.slice(-10);
    return lastLogs.map((line) => line.toString()).join('\n');
  };

  toString() {
    return this.lines.join('\n');
  }

  log(type: string) {
    return (message: string) => {
      const line = new Line(type, message);

      this.lines.push(line);

      if (!this.url) {
        return;
      }

      fs.appendFile(this.url, line.toString() + '\n');
    };
  }

  clear() {
    this.lines = [];
  }
}

export const logger = new Logger();
const message = logger.log('message');
const error = logger.log('error');
const info = logger.log('info');
const response = logger.log('response');
const controller = logger.log('controller');

export const log = {
  message,
  error,
  info,
  response,
  controller,
};
