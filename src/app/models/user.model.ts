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
  id: number;
  username: string;
  email: string;
  roleType: string;
}
