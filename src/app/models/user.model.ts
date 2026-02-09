export interface UsersDto {
  username: string;
  email: string;
  password: string;
  roleType?: string;
}

export interface LoginParamsDto {
  username: string;
  password: string;
}

export interface AuthenticatedUsersDto {
  serviceToken: string;
  userDto: {
    id: string;
    username: string;
    email: string;
    password: string | null;
    roleType: string;
  };
}
