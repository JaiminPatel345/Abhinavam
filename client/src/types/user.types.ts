import type {Route} from "expo-router";
import {IPost} from "@/types/posts.types";


export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  mobile?: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  tagline?: string;
  about?: string;
  interests?: string[];
  professions?: string[];
  followers: string[]; //user Id array  , not populated
  following: string[]; //user id
  posts: string[]; // post id array
}


export interface ICompleteProfilePayload {
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
  onSave: () => void;
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
  redirectUrl: Route | null;
  isImageUploading: boolean;
  lastFetched: number;

}
