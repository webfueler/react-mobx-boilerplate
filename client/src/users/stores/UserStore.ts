import { action, makeObservable, observable } from "mobx";
import type { IUser, IUserIdentifier, IUserService } from "../services";
import { UserRoutes } from "../services";
import { inject, injectable } from "inversify";
import { identifiers } from "../../container/constants";
import { RouteMatch } from "react-router-dom";
import { ServerSideFetcher } from "../../../../lib/src/router/interfaces";

interface IUserStore {
	user: IUser | null;
	users: IUser[] | null;
	page: number;
	loading: boolean;
	loadUsers: (params: IUserIdentifier) => Promise<IUser[] | null>;
	loadUser: (params: IUserIdentifier) => Promise<IUser | null>;
}

@injectable()
class UserStore implements IUserStore, ServerSideFetcher {
	@observable user: IUser | null = null;
	@observable users: IUser[] = [];
	@observable page = 1;
	@observable loading = false;

	constructor(
		@inject(identifiers.IUserService)
		private readonly userService: IUserService,
	) {
		makeObservable(this);
	}

	public async serverSideFetch(routeMatch: RouteMatch): Promise<unknown> {
		const {
			params: { page, id },
		} = routeMatch;

		const computedPage = page ? Number.parseInt(page) : 1;

		if (id) {
			const params = UserRoutes.getUserFromSlug(id || "");
			if (!params) return;

			return await this.loadUser(params);
		}

		return await this.loadUsers({
			page: computedPage,
		});
	}

	@action
	loadUsers(params: IUserIdentifier): Promise<IUser[] | null> {
		if (params.email) {
			this.setUsers([]);
			return Promise.resolve(null);
		}

		this.setPage(params.page);
		this.setLoading(true);

		return this.userService
			.fetchUsers(params)
			.then((users) => {
				if (!users || Array.isArray(users)) {
					this.setUsers([]);
					return null;
				}
				this.setUsers(users.results);
				return users.results;
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// just a dummy implementation for a "detail page"
	// using the url params
	@action
	loadUser(params: IUserIdentifier): Promise<IUser | null> {
		if (params.email === "") {
			this.setUser(null);
			return Promise.resolve(null);
		}

		this.setPage(params.page);
		this.setLoading(true);

		return this.userService
			.fetchUsers(params)
			.then((users) => {
				if (!users || !Array.isArray(users)) {
					this.setUser(null);
					return null;
				}
				this.setUser(users[0]);
				return users[0];
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	@action
	setUser(user: IUser | null): void {
		this.user = user;
	}

	@action
	setUsers(users: IUser[]): void {
		this.users = users;
	}

	@action
	setPage(page: number): void {
		this.page = page;
	}

	@action
	setLoading(value: boolean): void {
		this.loading = value;
	}
}

export { UserStore };
export type { IUserStore };
