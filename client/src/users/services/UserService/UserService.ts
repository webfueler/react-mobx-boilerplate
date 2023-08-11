import { inject, injectable } from "inversify";
import { IUserResponse, IUserService } from "./interfaces";
import type { IFetchUsersResponse } from "./interfaces";
import { identifiers } from "../../../../../lib/src/container/constants";
import type { IHttpService } from "../../../../../lib/src/services";

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
		const results = this.httpService
			.get<IUserResponse>(
				`https://randomuser.me/api/?page=${page}&results=${resultsPerPage}&seed=inversifyjs`,
			)
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
