import React from "react";
import { NavLink } from "react-router-dom";
import { CartTotal } from "./CartTotal";

const headerMenu = [
	{
		name: "Home",
		to: "/",
	},
	{
		name: "Cart",
		to: "/cart",
	},
	{
		name: "Users",
		to: "/users",
	},
];

const Header = (): React.ReactElement => (
	<header className="header">
		<ul className="header__nav">
			{headerMenu.map((menu) => (
				<li className="header__nav-item" key={menu.to}>
					<NavLink to={menu.to} className="header__nav-link">
						{menu.name}
					</NavLink>
				</li>
			))}
		</ul>
		<CartTotal />
	</header>
);

export { Header };
