
export interface EmailResult {
  email: string;
  status: 'live' | 'Verify' | 'Disabled' | 'Error' | 'Unregistered';
}

export interface CheckerState {
  good: string[];
  verified: string[];
  disabled: string[];
  notExist: string[];
  unknown: string[];
  total: number;
}

export enum CheckerMode {
  PRECISION = 1,
  DETAILED = 2,
  FAST = 3
}

export interface UserSession {
  email: string;
  isLoggedIn: boolean;
}
