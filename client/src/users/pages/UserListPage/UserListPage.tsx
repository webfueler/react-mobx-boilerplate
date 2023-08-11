import React from "react";
import { useParams } from "react-router-dom";
import { UserList } from "../../components/UserList";
import { Pagination } from "../../components/Pagination";
import type { IUserStore } from "../../stores";
import { Head } from "../../../../../lib/src/components/Head";
import { withModule } from "../../../../../lib/src/container/WithModule";
import { identifiers } from "../../../container";

type Modules = {
	userStore: IUserStore;
};

type Props = Modules;

const UserListPageComponent = ({ userStore }: Props): React.ReactElement => {
	const { page: routePage } = useParams();
	const page = Number.parseInt(routePage || "1", 10);
	const { users, loading } = userStore;

	return (
		<>
			<Head>
				<title>Users List - Page {page}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className="user-list-page">
				<UserList users={users} loading={loading} currentPage={page} />
				<Pagination currentPage={page} />
			</div>
		</>
	);
};

const UserListPage = withModule<Modules>({ userStore: identifiers.IUserStore })(
	UserListPageComponent,
);

export { UserListPage };
