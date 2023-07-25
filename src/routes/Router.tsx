import * as React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { UserDetailPage } from "../pages/UserDetailPage";
import { Default as DefaultLayout } from "../layouts/Default";
import { UserListPage } from "../pages/UserListPage";
import { Homepage } from "../pages/Homepage";
import { useModule } from "../container";
import { CartPage } from "../pages/CartPage";

const AppRouter = (): React.ReactElement => {
	const { startupOptions } = useModule();

	const router = createBrowserRouter(
		[
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
		],
		{ basename: startupOptions.basename },
	);

	return <RouterProvider router={router} />;
};

export { AppRouter };
