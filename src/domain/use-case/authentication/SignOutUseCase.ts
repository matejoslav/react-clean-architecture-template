import { injectable, inject } from 'tsyringe';
import type { UseCase } from '../../../core/use-case/UseCase';
import type { AuthenticationRepository } from '../../repository/AuthenticationRepository';
import { AppDependencies } from '../../../di/types';

@injectable()
export class SignOutUseCase implements UseCase<void, void> {
  constructor(
    @inject(AppDependencies.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async call(): Promise<void> {
    await this.authenticationRepository.removeToken();
  }
}
