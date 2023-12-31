import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { IUserStore } from "../../lib/stores/UserStore";
import { withModule } from "../../container/WithModule";
import { UserList } from "../../components/UserList";
import { Pagination } from "../../components/Pagination";
import { identifiers } from "../../container/constants";

type Modules = {
	userStore: IUserStore;
};

type Props = Modules;

const UserListPageComponent = ({ userStore }: Props): React.ReactElement => {
	const { page: routePage } = useParams();
	const page = Number.parseInt(routePage || "1", 10);
	const { users, loading } = userStore;

	const onPageChange = (): void => {
		userStore
			.loadUsers({ page })
			.catch((error: Error) => console.log(error.message));
	};

	useEffect(onPageChange, [page, userStore]);

	return (
		<div className="user-list-page">
			<UserList users={users} loading={loading} currentPage={page} />
			<Pagination currentPage={page} />
		</div>
	);
};

const UserListPage = withModule<Modules>({ userStore: identifiers.IUserStore })(
	UserListPageComponent,
);

export { UserListPage };
