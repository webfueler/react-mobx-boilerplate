import React from "react";
import { Link } from "react-router-dom";
import { UserRoutes } from "../lib/utilities/UserRoutes";
import type { IUser } from "../lib/services/UserService";

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
			<ul className={loading ? "is-loading" : ""}>
				{users.map((user) => (
					<li key={user.email}>
						<Link
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
