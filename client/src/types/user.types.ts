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


export interface SignupFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AdditionalDetailsData {
  mobile?: string;
  interests: string[];
  profession: string[];
  about: string;
}

export interface SelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  items: string[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  selectedItems: string[];
  onItemSelect: (item: string) => void;
}