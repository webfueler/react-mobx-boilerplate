import "./index.scss";

import React from "react";
import { NavLink } from "react-router-dom";
import { useModule } from "../../container";
import { observer } from "mobx-react";

const Header = observer((): React.ReactElement => {
	const { cartStore } = useModule();

	return (
		<header className="header">
			<ul className="header__nav">
				<li className="header__nav-item">
					<NavLink to="/">Home</NavLink>
				</li>
				<li className="header__nav-item">
					<NavLink to="/cart">Cart</NavLink>
				</li>
				<li className="header__nav-item">
					<NavLink to="/users">Users</NavLink>
				</li>
			</ul>
			<div className="header__total">
				Cart total: ${cartStore.total.toFixed(2)}
			</div>
		</header>
	);
});

export { Header };
