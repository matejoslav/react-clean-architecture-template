export interface Credential {
  email: string;
  password: string;
}

export interface SignInResult {
  token: string;
  fromLocal: boolean;
}
