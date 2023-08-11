import { injectable } from "inversify";
import { IUserIdentifier, IUserResponse, IUserService } from "./interfaces";
import type { IFetchUsersResponse } from "./interfaces";

@injectable()
class UserServiceWithCache implements IUserService {
	// don't do cache like this, it will break your app
	private cache: Map<string, string> = new Map();

	fetchUsers = ({
		page = 1,
		resultsPerPage = 10,
		email = "",
	}: IUserIdentifier): Promise<IFetchUsersResponse> => {
		const url = `https://randomuser.me/api/?page=${page}&results=${resultsPerPage}&seed=inversifyjs`;
		if (this.cache.has(url)) {
			const users = JSON.parse(this.cache.get(url)!) as IUserResponse;
			return Promise.resolve(
				email === ""
					? users
					: users.results.filter((user) => user.email === email),
			);
		}

		const results = fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((users: IUserResponse) => {
				this.cache.set(url, JSON.stringify(users));
				return email === ""
					? users
					: users.results.filter((user) => user.email === email);
			})
			.catch((error) => {
				throw new Error(error);
			});

		return results;
	};
}

export { UserServiceWithCache };
