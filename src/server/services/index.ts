import { ContainerModule } from "inversify";
import { HttpService, IHttpService } from "./HttpService";
import { identifiers } from "../../container/constants";
import { TTLCache, type ITTLCache } from "./TtlCacheService";
import { serverIdentifiers } from "./constants";

const serverContainerModule = new ContainerModule((bind) => {
	bind<IHttpService>(identifiers.IHttpService).to(HttpService);
	bind<ITTLCache<Record<string, unknown>>>(serverIdentifiers.ITTLCache).to(
		TTLCache,
	);
});

export { serverContainerModule };
