import { injectable, inject } from 'tsyringe';
import type { AuthenticationRepository } from '../../domain/repository/AuthenticationRepository';
import type { Credential, SignInResult } from '../../domain/entity/Authentication';
import type { LocalAuthenticationDataSource } from '../data-source/authentication/LocalAuthenticationDataSource';
import type { RemoteAuthenticationDataSource } from '../data-source/authentication/RemoteAuthenticationDataSource';
import { AppDependencies } from '../../di/types';

@injectable()
export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  constructor(
    @inject(AppDependencies.RemoteAuthenticationDataSource)
    private readonly remoteDataSource: RemoteAuthenticationDataSource,
    @inject(AppDependencies.LocalAuthenticationDataSource)
    private readonly localDataSource: LocalAuthenticationDataSource,
  ) {}

  async signIn(credential: Credential): Promise<SignInResult> {
    const response = await this.remoteDataSource.signIn(credential);
    return { token: response.token, fromLocal: false };
  }

  async getToken(): Promise<string> {
    return this.localDataSource.getToken();
  }

  async saveToken(token: string): Promise<boolean> {
    return this.localDataSource.saveToken(token);
  }

  async removeToken(): Promise<void> {
    return this.localDataSource.removeToken();
  }
}
