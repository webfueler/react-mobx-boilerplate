import { servicesIdentifiers } from "../lib/services/constants";
import { storesIdentifiers } from "../lib/stores/constants";

const identifiers = {
	...servicesIdentifiers,
	...storesIdentifiers,
	IStartupOptions: Symbol.for("IStartupOptions"),
	IInitialState: Symbol.for("IInitialState"),
};

export { identifiers };
