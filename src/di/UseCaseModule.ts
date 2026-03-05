import { container } from 'tsyringe';
import { SignInUseCase } from '../domain/use-case/authentication/SignInUseCase';
import { SignOutUseCase } from '../domain/use-case/authentication/SignOutUseCase';
import { AppDependencies } from './types';

export function registerUseCaseDependencies(): void {
  container.register(AppDependencies.SignInUseCase, {
    useClass: SignInUseCase,
  });

  container.register(AppDependencies.SignOutUseCase, {
    useClass: SignOutUseCase,
  });
}
