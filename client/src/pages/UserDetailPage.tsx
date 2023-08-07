import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserRoutes } from "../lib/utilities/UserRoutes";
import { IUserStore } from "../lib/stores/UserStore";
import { withModule } from "../../../common/src/container/WithModule";
import { identifiers } from "../container/constants";

type Modules = {
	userStore: IUserStore;
};

type Props = Modules;

const UserDetailPageComponent = ({ userStore }: Props): React.ReactElement => {
	const { id: routeId } = useParams();
	const { user, loading } = userStore;

	const onUserChange = (): void => {
		const params = UserRoutes.getUserFromSlug(routeId || "");
		if (!params) {
			return;
		}
		userStore
			.loadUser(params)
			.catch((error: Error) => console.log(error.message));
	};

	useEffect(onUserChange, [routeId, userStore]);

	return (
		<>
			{user ? (
				<div className={loading ? "is-loading" : ""}>
					<h3>
						{user.name.title} {user.name.first} {user.name.last}
					</h3>
					<h5>{user.email}</h5>
					<img src={user.picture.medium} alt={user.name.first} />
				</div>
			) : (
				<div>User not found</div>
			)}
		</>
	);
};

const UserDetailPage = withModule<Modules>({
	userStore: identifiers.IUserStore,
})(UserDetailPageComponent);

export { UserDetailPage };
