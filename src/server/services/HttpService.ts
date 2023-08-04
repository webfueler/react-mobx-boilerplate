import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import serializeJavascript from "serialize-javascript";
import { serverIdentifiers } from "./constants";
import { type ITTLCache } from "./TtlCacheService";

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
		@inject(serverIdentifiers.ITTLCache)
		private readonly cacheService: ITTLCache<unknown>,
	) {
		this.requestConfig = {
			headers: {
				pragma: "no-cache",
				"cache-control": "no-cache",
			},
		};
		this.httpClient = axios.create(this.requestConfig);
		this.cacheService.setTTL(5);
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

			const response = await this.httpClient.get<TResponse>(url, requestConfig);
			this.cacheService.put(url, response.data);
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
