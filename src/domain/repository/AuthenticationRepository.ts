import type { Credential, SignInResult } from '../entity/Authentication';

export interface AuthenticationRepository {
  signIn(credential: Credential): Promise<SignInResult>;
  getToken(): Promise<string>;
  saveToken(token: string): Promise<boolean>;
  removeToken(): Promise<void>;
}
