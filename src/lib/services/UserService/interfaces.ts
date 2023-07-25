interface IUserPicture {
  thumbnail: string;
  medium: string;
  large: string;
}

interface IUserName {
  title: string;
  first: string;
  last: string;
}

export interface IUser {
  name: IUserName;
  email: string;
  picture: IUserPicture;
  id: {
    name: string;
    value: string;
  };
}

export interface IUserResponse {
  results: IUser[];
}

export type IFetchUsersResponse = IUserResponse | IUser[] | null;

export interface IUserService {
  fetchUsers: (
    user: IUserIdentifier
  ) => Promise<IUserResponse | IUser[] | null>;
}

export interface IUserIdentifier {
  page: number;
  resultsPerPage?: number;
  email?: string;
}
