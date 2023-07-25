import { ILoggerService } from "./interfaces";

class LoggerService implements ILoggerService {
	constructor(private console: Console = (global || window).console) {}

	public error(msg: string): void {
		this.console.error(msg);
	}

	public info(msg: string): void {
		this.console.info(msg);
	}

	public warn(msg: string): void {
		this.console.warn(msg);
	}
}

export { LoggerService };
