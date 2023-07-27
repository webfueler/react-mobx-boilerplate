import { servicesIdentifiers } from "../lib/services/constants";
import { storesIdentifiers } from "../lib/stores/constants";

const identifiers = {
	...servicesIdentifiers,
	...storesIdentifiers,
	IStartupOptions: Symbol.for("IStartupOptions"),
};

export { identifiers };
