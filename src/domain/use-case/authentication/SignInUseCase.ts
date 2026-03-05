import { injectable, inject } from 'tsyringe';
import type { UseCase } from '../../../core/use-case/UseCase';
import type { Credential, SignInResult } from '../../entity/Authentication';
import type { AuthenticationRepository } from '../../repository/AuthenticationRepository';
import { AppDependencies } from '../../../di/types';

@injectable()
export class SignInUseCase implements UseCase<SignInResult, Credential | undefined> {
  constructor(
    @inject(AppDependencies.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async call(params?: Credential): Promise<SignInResult> {
    if (!params) {
      return this.localSignIn();
    }
    return this.remoteSignIn(params);
  }

  private async localSignIn(): Promise<SignInResult> {
    const token = await this.authenticationRepository.getToken();
    return { token, fromLocal: true };
  }

  private async remoteSignIn(credential: Credential): Promise<SignInResult> {
    const result = await this.authenticationRepository.signIn(credential);
    await this.authenticationRepository.saveToken(result.token);
    return result;
  }
}
