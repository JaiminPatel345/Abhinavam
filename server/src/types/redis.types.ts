// src/types/redis.types.ts

export interface IRedisOtpData {
  generatedOtp: string;
  email: string;
}

export interface IRedisUtils {
  getEmailAndOtp: (email: string) => Promise<IRedisOtpData | null>;
  setEmailAndOtp: (email: string, otp: string) => Promise<void>;
  removeEmailAndOtp: (email: string) => Promise<void>;
}

export interface IRedisPayload {
  email: string,
  otp: string,
  wrongTry: number,
}

