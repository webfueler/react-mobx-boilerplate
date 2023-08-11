import React from "react";
import { Link } from "react-router-dom";
import { UserRoutes, type IUser } from "../../services";

type Props = {
	currentPage: number;
	users: IUser[] | null;
	loading: boolean;
};

const UserList = ({
	currentPage,
	users,
	loading,
}: Props): React.ReactElement | null => {
	return (
		users && (
			<ul className={`${loading ? "is-loading" : ""} user-list`}>
				{users.map((user) => (
					<li key={user.email} className="user-list__item">
						<Link
							className="user-list__link"
							to={`/user/${UserRoutes.createUserSlug({
								page: currentPage,
								resultsPerPage: 10,
								email: user.email,
							})}`}
						>
							{user.email}
						</Link>
					</li>
				))}
			</ul>
		)
	);
};

export { UserList };
