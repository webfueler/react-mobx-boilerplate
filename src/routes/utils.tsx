import React from "react";
import { Route, RouteObject, Routes } from "react-router-dom";

/**
 * Recursive function to build the Routes tree
 * @param view - Route element that represents path or view
 * @returns Route Element
 */
const getChildRoutes = (
	route: RouteObject,
): React.ReactElement | React.ReactElement[] => {
	if (!route.children || route.children.length === 0) {
		return (
			<Route path={route.path} element={route.element} index={route.index} />
		);
	}

	const { path, element, children, index } = route;
	return children.map((childRoute) => (
		<Route path={path} element={element} index={index} key={path}>
			{getChildRoutes(childRoute)}
		</Route>
	));
};

const buildRoutes = (routes: RouteObject[]): React.ReactNode => (
	<Routes>{routes.map((route) => getChildRoutes(route))}</Routes>
);

export { buildRoutes };
