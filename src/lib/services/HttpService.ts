import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import { type InitialState } from "../../entry-client";
import { identifiers } from "../../container/constants";

export type TRequestConfig = AxiosRequestConfig;

export interface IHttpService {
	post: <TRequest, TResponse>(
		url: string,
		object: TRequest,
		config?: TRequestConfig,
	) => Promise<TResponse>;
	get: <TResponse>(url: string, config?: TRequestConfig) => Promise<TResponse>;
}

@injectable()
class HttpService implements IHttpService {
	private httpClient: AxiosInstance;
	private requestConfig: TRequestConfig;

	constructor(
		@inject(identifiers.IInitialState)
		private readonly initialState: InitialState,
	) {
		this.requestConfig = {
			headers: {
				pragma: "no-cache",
				"cache-control": "no-cache",
			},
		};
		this.httpClient = axios.create(this.requestConfig);
	}

	private handleError(error: unknown): void {
		// this.loggerService.error(`Error during HTTP Request \n${error as string}`);
	}

	async get<TResponse>(
		url: string,
		config?: TRequestConfig,
	): Promise<TResponse> {
		try {
			const requestConfig = config
				? Object.assign(this.requestConfig, config)
				: undefined;

			if (this.initialState.data[url]) {
				return this.initialState.data[url];
			}

			const response = await this.httpClient.get<TResponse>(url, requestConfig);
			return response.data;
		} catch (error) {
			this.handleError(error);
			throw new Error(error instanceof Error ? error.message : String(error));
		}
	}

	async post<TRequest, TResponse>(
		url: string,
		object: TRequest,
		config?: TRequestConfig,
	): Promise<TResponse> {
		try {
			const requestConfig = config
				? Object.assign(this.requestConfig, config)
				: undefined;
			const response = await this.httpClient.post<TResponse>(
				url,
				object,
				requestConfig,
			);
			return response.data;
		} catch (error) {
			this.handleError(error);
			throw new Error(error instanceof Error ? error.message : String(error));
		}
	}
}

export { HttpService };
