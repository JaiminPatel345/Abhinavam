export interface IRedisPayload {
  email: string,
  otp: string,
  wrongTry: number,
}

export interface IRedisOtpData {
  email: string;
  generatedOtp: string;
  wrongAttempts: number;
  createdAt: string;
}

export interface IRedisUtils {
  setEmailAndOtp: (email: string, generatedOtp: string) => Promise<boolean>;
  getEmailAndOtp: (email: string) => Promise<IRedisOtpData | null>;
  removeEmailAndOtp: (email: string) => Promise<boolean>;
  incrementWrongAttempts: (email: string) => Promise<boolean>;
}
