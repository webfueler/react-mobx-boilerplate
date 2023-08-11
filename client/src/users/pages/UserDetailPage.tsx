import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserRoutes } from "../services";
import type { IUserStore } from "../stores";
import { Head } from "../../../../lib/src/components/Head";
import { HttpError } from "../../../../lib/src/components/HttpError";
import { withModule } from "../../../../lib/src/container/WithModule";
import { identifiers } from "../../container";

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

	return user ? (
		<>
			<Head>
				<title>
					{user?.name.first} {user?.name.last}
				</title>
			</Head>

			<div className={loading ? "is-loading" : ""}>
				<h3>
					{user.name.title} {user.name.first} {user.name.last}
				</h3>
				<h5>{user.email}</h5>
				<img src={user.picture.medium} alt={user.name.first} />
			</div>
		</>
	) : (
		<HttpError status={404}>
			<div>User not found</div>
		</HttpError>
	);
};

const UserDetailPage = withModule<Modules>({
	userStore: identifiers.IUserStore,
})(UserDetailPageComponent);

export { UserDetailPage };
