import React from "react";
import { HttpStatusCode } from "axios";
import { useInjection } from "../container/UseInjection";
import { IHttpErrorService } from "../services/HttpErrorService";
import { identifiers } from "../container/constants";

const httpErrorStatus = {
	[HttpStatusCode.NotFound]: HttpStatusCode.NotFound,
	[HttpStatusCode.Forbidden]: HttpStatusCode.Forbidden,
	[HttpStatusCode.InternalServerError]: HttpStatusCode.InternalServerError,
} as const;

type HttpErrorStatusCode = keyof typeof httpErrorStatus;

type ErrorProps = {
	status: HttpErrorStatusCode;
};

const HttpServerError = ({
	status,
	children,
}: React.PropsWithChildren<ErrorProps>): React.ReactNode => {
	const httpErrorService = useInjection<IHttpErrorService>(
		identifiers.IHttpErrorService,
	);
	httpErrorService.setError(status);

	return children;
};

const HttpError = ({
	status,
	children,
}: React.PropsWithChildren<ErrorProps>): React.ReactNode => {
	if (!__isBrowser__)
		return <HttpServerError status={status}>{children}</HttpServerError>;

	return children;
};

export { HttpError };
export type { HttpErrorStatusCode };
