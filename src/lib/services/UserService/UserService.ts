import { inject, injectable } from "inversify";
import { IUserResponse, IUserService } from "./interfaces";
import type { IFetchUsersResponse } from "./interfaces";
import { identifiers } from "../../../container/constants";
import type { IHttpService } from "../HttpService";

@injectable()
class UserService implements IUserService {
	constructor(
		@inject(identifiers.IHttpService) private httpService: IHttpService,
	) {}

	fetchUsers = ({
		page = 1,
		resultsPerPage = 10,
		email = "",
	}): Promise<IFetchUsersResponse> => {
		console.time("API response time");
		const results = this.httpService
			.get<IUserResponse>(
				`https://randomuser.me/api/?page=${page}&results=${resultsPerPage}&seed=inversifyjs`,
			)
			.then((users: IUserResponse) => {
				console.timeEnd("API response time");
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
