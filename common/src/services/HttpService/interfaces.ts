import type { AxiosRequestConfig } from "axios";

export type TRequestConfig = AxiosRequestConfig;

export interface IHttpService {
	post: <TRequest, TResponse = unknown>(
		url: string,
		object: TRequest,
		config?: TRequestConfig,
	) => Promise<TResponse>;
	get: <TResponse>(url: string, config?: TRequestConfig) => Promise<TResponse>;
}
