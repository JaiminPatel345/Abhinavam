export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  mobile?: string;
  password: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  tagLine?: string;
  about?: string;
  interests?: string[];
  profession?: string[];
}

export interface IUserResponse {
  user: IUser | null,
  token: string | null;
}

export interface UserState {
  user: IUser | null;
  token: string | null;
}

export interface ICompleteProfilePayload{
      avatar?: {
        url: string,
        public_id: string,
      },
      tagline?: string,
      about?: string,
      interests?: string[],
      professions?: string[]
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
  isLoggedIn: boolean;
  isLoading: boolean;
  redirectUrl: string | null;
  isImageUploading: boolean;
  // error: string | null;
}

export type ImageData = {
  uri: string;
  type: string;
  name: string;

}