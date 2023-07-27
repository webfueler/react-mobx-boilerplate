import { injectable, optional, unmanaged } from "inversify";
import { ILoggerService } from "./interfaces";

/**
 * @deprecated - It's just a wrapper for the inversify bug. There is a type mismatch that should not exist and the fix is not merged yet.
 * {@link https://github.com/inversify/InversifyJS/pull/1499}
 */
function unmanagedWrapper() {
	return (
		target: object,
		propertyKey: string | symbol | undefined,
		index: number,
	): void => {
		return unmanaged()(target, propertyKey as never, index);
	};
}

@injectable()
class LoggerService implements ILoggerService {
	constructor(
		@optional()
		@unmanagedWrapper()
		private console: Console = (global || window).console,
	) {}

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
