import type { IUserIdentifier } from "./UserService";

class UserRoutes {
	public static getUserFromSlug(slug: string): IUserIdentifier | null {
		if (!slug) return null;

		try {
			const route = slug.split("-");
			const [page, resultsPerPage, email] = route;
			return {
				page: Number.parseInt(page, 10),
				resultsPerPage: Number.parseInt(resultsPerPage, 10),
				email,
			};
		} catch {
			return null;
		}
	}

	public static createUserSlug(user: IUserIdentifier): string {
		if (!user.resultsPerPage || !user.email) {
			throw new Error("invalid user identifier");
		}
		return `${user.page}-${user.resultsPerPage}-${user.email}`;
	}
}

export { UserRoutes };
