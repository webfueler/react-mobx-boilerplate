import React from "react";
import { UserDetailPage } from "../pages/UserDetailPage";
import { Default as DefaultLayout } from "../layouts/Default";
import { UserListPage } from "../pages/UserListPage";
import { Homepage } from "../pages/Homepage";
import { CartPage } from "../pages/CartPage";
import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{
				index: true,
				element: <Homepage />,
			},
			{
				path: "cart",
				element: <CartPage />,
			},
			{
				path: "users",
				element: <UserListPage />,
				children: [
					{
						path: ":page",
						element: <UserListPage />,
					},
				],
			},
			{
				path: "user",
				element: <UserDetailPage />,
				children: [
					{
						path: ":id",
						element: <UserDetailPage />,
					},
				],
			},
		],
	},
];

export { routes };
