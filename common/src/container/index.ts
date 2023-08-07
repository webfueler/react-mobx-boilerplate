import { ContainerModule } from "inversify";
import {
	ClientHttpService,
	ServerHttpService,
	type IHttpService,
} from "../services/HttpService";
import { identifiers } from "./constants";
import { type ITTLCache, TTLCache } from "../services";
import {
	HttpErrorService,
	type IHttpErrorService,
} from "../services/HttpErrorService";

const clientModule = new ContainerModule((bind) => {
	bind<IHttpService>(identifiers.IHttpService).to(ClientHttpService);
});

const serverModule = new ContainerModule((bind) => {
	bind<IHttpService>(identifiers.IHttpService).to(ServerHttpService);
	bind<ITTLCache<Record<string, unknown>>>(identifiers.ITTLCache).to(TTLCache);
	bind<IHttpErrorService>(identifiers.IHttpErrorService).to(HttpErrorService);
});

export { serverModule, clientModule };
