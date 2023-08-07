import React from "react";
import { buildRoutes } from "../../common/src/router/utils";
import { routes } from "./routes/routes";

export const App = (): React.ReactElement => {
	return <div className="my-app">{buildRoutes(routes)}</div>;
};
