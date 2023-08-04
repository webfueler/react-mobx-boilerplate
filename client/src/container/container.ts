import { servicesContainerModule } from "../lib/services";
import { storesContainerModule } from "../lib/stores";
import { Container } from "inversify";

const container = new Container({ defaultScope: "Singleton" });
container.load(storesContainerModule, servicesContainerModule);
export { container };
