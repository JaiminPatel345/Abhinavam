export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  tagLine?: string;
  about?: string;
  interest: string[];
  profession: string[];
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


export interface ILoginCredentials {
  email: string;
  password: string;
}


export interface SignupFormData {
fullName: string;
  username: string;
  email: string;
  //TODO: make separate for mobile
  // mobile: string;
  password: string;
  confirmPassword: string;
}

export interface AdditionalDetailsData {
  mobile?: string;
  interests: string[];
  profession: string[];
  about: string;
}

export interface SelectPickerProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  items: string[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  selectedItems: string[];
  onItemSelect: (item: string) => void;
}

export interface IRegisterUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  // mobile?: string;
}

export interface IVerifyOtp {
  otp: string;
  email: string;
}


export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isLoading: boolean;
  redirectUrl: string | null;
  // error: string | null;
}