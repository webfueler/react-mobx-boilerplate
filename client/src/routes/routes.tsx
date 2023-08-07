import React from "react";
import { UserDetailPage } from "../pages/UserDetailPage";
import { Default as DefaultLayout } from "../layouts/Default";
import { UserListPage } from "../pages/UserListPage";
import { Homepage } from "../pages/Homepage";
import { CartPage } from "../pages/CartPage";
import type { AppRouteObject } from "../../../common/src/router/interfaces";
import { identifiers } from "../container/constants";

const routes: AppRouteObject[] = [
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{
				index: true,
				element: <Homepage />,
				fetchData: [identifiers.IProductStore],
			},
			{
				path: "/cart",
				element: <CartPage />,
			},
			{
				path: "/users",
				element: <UserListPage />,
				fetchData: [identifiers.IUserStore],
				children: [
					{
						path: ":page",
						element: <UserListPage />,
						fetchData: [identifiers.IUserStore],
					},
				],
			},
			{
				path: "/user",
				element: <UserDetailPage />,
				children: [
					{
						path: ":id",
						element: <UserDetailPage />,
						fetchData: [identifiers.IUserStore],
					},
				],
			},
		],
	},
];

export { routes };
