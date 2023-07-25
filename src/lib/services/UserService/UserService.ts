import { IUserResponse, IUserService } from "./interfaces";
import type { IFetchUsersResponse } from "./interfaces";

class UserService implements IUserService {
	fetchUsers = ({
		page = 1,
		resultsPerPage = 10,
		email = "",
	}): Promise<IFetchUsersResponse> => {
		console.time("API response time");
		const results = fetch(
			`https://randomuser.me/api/?page=${page}&results=${resultsPerPage}&seed=inversifyjs`,
		)
			.then((response) => {
				console.timeEnd("API response time");
				return response.json();
			})
			.then((users: IUserResponse) => {
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

export { UserService };
