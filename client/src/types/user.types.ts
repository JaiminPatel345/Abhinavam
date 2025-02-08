export interface IUser {
    id: string;
    name: string;
    email: string;
    username: string;
    about: string;
    interest: string[];
    profession: string[];
    isEmailVerified: boolean;
    isMobileVerified: boolean;
}

export interface IUserResponse {
    user: IUser | null,
    token: string | null;
}

export interface UserState {
    user: IUser | null;
    token: string | null;
}



export interface ILoginCredentials{
    email: string;
    password: string;
}