import { action, makeObservable, observable } from "mobx";
import type {
	IUser,
	IUserIdentifier,
	IUserService,
} from "../services/UserService/interfaces";

interface IUserStore {
	user: IUser | null;
	users: IUser[] | null;
	page: number;
	loading: boolean;
	loadUsers: (params: IUserIdentifier) => Promise<IUser[] | null>;
	loadUser: (params: IUserIdentifier) => Promise<IUser | null>;
}

class UserStore implements IUserStore {
	@observable user: IUser | null = null;
	@observable users: IUser[] = [];
	@observable page = 1;
	@observable loading = false;

	constructor(private readonly userService: IUserService) {
		makeObservable(this);
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
