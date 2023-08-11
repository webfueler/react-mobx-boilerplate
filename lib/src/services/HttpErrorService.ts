import { injectable } from "inversify";
import { HttpErrorStatusCode } from "../components/HttpError";

interface IHttpErrorService {
	setError(errorCode: HttpErrorStatusCode | undefined): void;
	getErrorCode(): HttpErrorStatusCode | undefined;
}

@injectable()
class HttpErrorService implements IHttpErrorService {
	private errorCode: HttpErrorStatusCode | undefined;

	setError(errorCode: HttpErrorStatusCode | undefined): void {
		this.errorCode = errorCode;
	}

	getErrorCode(): HttpErrorStatusCode | undefined {
		return this.errorCode;
	}
}

export { HttpErrorService };
export type { IHttpErrorService };
