import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

const DefaultLayout = (): React.ReactElement => {
	return (
		<>
			<Header />
			<main className="main">
				<Outlet />
			</main>
		</>
	);
};

export { DefaultLayout };
