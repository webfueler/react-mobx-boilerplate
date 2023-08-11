import React from "react";
import type { AppRouteObject } from "../../../lib/src/router/interfaces";
import { identifiers } from "../container/constants";
import { HttpError } from "../../../lib/src/components/HttpError";
import { ProductPage } from "../products";
import { DefaultLayout } from "../shared/layouts/DefaultLayout";
import { CartPage } from "../cart";
import { UserDetailPage, UserListPage } from "../users";

const routes: AppRouteObject[] = [
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{
				index: true,
				element: <ProductPage />,
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
	{
		path: "*",
		element: (
			<HttpError status={404}>
				<h1>Not Found</h1>
			</HttpError>
		),
	},
];

export { routes };
