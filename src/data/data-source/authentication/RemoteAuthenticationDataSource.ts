import { injectable, inject } from 'tsyringe';
import type { RemoteProvider } from '../../../core/api/RemoteProvider';
import type { SignInRequest, SignInResponse } from '../../model/AuthenticationModels';
import { RemoteException } from '../../../core/error/Exception';
import { AppDependencies } from '../../../di/types';

export interface RemoteAuthenticationDataSource {
  signIn(body: SignInRequest): Promise<SignInResponse>;
}

/**
 * Real API data source — swap MockAuthenticationDataSource for this
 * once you have a working backend.
 */
@injectable()
export class ApiAuthenticationDataSource implements RemoteAuthenticationDataSource {
  constructor(
    @inject(AppDependencies.ApiProvider)
    private readonly provider: RemoteProvider,
  ) {}

  async signIn(body: SignInRequest): Promise<SignInResponse> {
    const response = await this.provider.post<SignInResponse>('/api/login', body);
    return response.data;
  }
}

const VALID_EMAIL = 'user@example.com';

/**
 * Mock data source for demo purposes — no external API dependency.
 * Accepts any password with the email above.
 */
@injectable()
export class MockAuthenticationDataSource implements RemoteAuthenticationDataSource {
  async signIn(body: SignInRequest): Promise<SignInResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (body.email !== VALID_EMAIL) {
      throw new RemoteException(null, 'Invalid email or password');
    }

    return { token: 'mock-jwt-token-' + Date.now() };
  }
}
