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
export const messageLogger = logger.log('message');
export const errorLogger = logger.log('error');
export const infoLogger = logger.log('info');

export const responseLogger = logger.log('response');

export const controllerLogger = logger.log('controller');
