import {
	IndexRouteObject,
	NonIndexRouteObject,
	RouteMatch,
} from "react-router-dom";

export interface ServerSideFetcher {
	serverSideFetch: (routeMatch: RouteMatch) => Promise<unknown>;
}

export const isServerSideFetcher = (
	value: unknown,
): value is ServerSideFetcher =>
	value !== null &&
	value !== undefined &&
	typeof value === "object" &&
	"serverSideFetch" in value &&
	value.serverSideFetch !== null &&
	value.serverSideFetch !== undefined &&
	typeof value.serverSideFetch === "function";

export interface RoutePrefetch {
	fetchData?: Array<symbol>;
}

export interface AppIndexRouteObject extends RoutePrefetch {
	path?: IndexRouteObject["path"];
	id?: IndexRouteObject["id"];
	index?: IndexRouteObject["index"];
	children?: IndexRouteObject["children"];
	element?: IndexRouteObject["element"];
	errorElement?: IndexRouteObject["element"];
}

export interface AppNonIndexRouteObject extends RoutePrefetch {
	path?: NonIndexRouteObject["path"];
	id?: NonIndexRouteObject["id"];
	index?: NonIndexRouteObject["index"];
	children?: AppRouteObject[];
	element?: NonIndexRouteObject["element"];
	errorElement?: NonIndexRouteObject["element"];
}

/** copy of {@link RouteObject} to be able to add extra types */
export type AppRouteObject = AppIndexRouteObject | AppNonIndexRouteObject;
