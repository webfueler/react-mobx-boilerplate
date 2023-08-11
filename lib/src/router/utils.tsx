import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppRouteObject } from "./interfaces";

/**
 * Recursive function to build the Routes tree
 * @param view - Route element that represents path or view
 * @returns Route Element
 */
const getChildRoutes = (
	route: AppRouteObject,
): React.ReactElement | React.ReactElement[] => {
	if (!route.children || route.children.length === 0) {
		return (
			<Route
				path={route.path}
				element={route.element}
				index={route.index}
				key={route.path}
			/>
		);
	}

	const { path, element, children, index } = route;
	return children.map((childRoute) => (
		<Route path={path} element={element} index={index} key={path}>
			{getChildRoutes(childRoute)}
		</Route>
	));
};

const buildRoutes = (routes: AppRouteObject[]): React.ReactNode => (
	<Routes>{routes.map((route) => getChildRoutes(route))}</Routes>
);

export { buildRoutes };
