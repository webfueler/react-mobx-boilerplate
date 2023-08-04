import { ContainerModule } from "inversify";
import {
	ClientHttpService,
	ServerHttpService,
	type IHttpService,
} from "../services/HttpService";
import { identifiers } from "./constants";
import { type ITTLCache, TTLCache } from "../services";

const commonContainerModule = new ContainerModule((bind) => {
	bind<IHttpService>(identifiers.IHttpService).to(
		__isBrowser__ ? ClientHttpService : ServerHttpService,
	);
	bind<ITTLCache<Record<string, unknown>>>(identifiers.ITTLCache).to(TTLCache);
});

export { commonContainerModule };
