import { servicesIdentifiers } from "../lib/services/constants";
import { storesIdentifiers } from "../lib/stores/constants";

const identifiers = {
	...servicesIdentifiers,
	...storesIdentifiers,
};

export { identifiers };
