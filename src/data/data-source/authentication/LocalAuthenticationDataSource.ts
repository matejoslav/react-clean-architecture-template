import { injectable } from 'tsyringe';
import { LocalException } from '../../../core/error/Exception';

const TOKEN_KEY = 'auth_token';

export interface LocalAuthenticationDataSource {
  saveToken(token: string): Promise<boolean>;
  getToken(): Promise<string>;
  removeToken(): Promise<void>;
}

@injectable()
export class LocalStorageAuthenticationDataSource implements LocalAuthenticationDataSource {
  async saveToken(token: string): Promise<boolean> {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      return true;
    } catch (error) {
      throw new LocalException(error);
    }
  }

  async getToken(): Promise<string> {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        return token;
      }
      throw new LocalException('No token found');
    } catch (error) {
      if (error instanceof LocalException) {
        throw error;
      }
      throw new LocalException(error);
    }
  }

  async removeToken(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
  }
}
