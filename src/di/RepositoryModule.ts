import { container } from 'tsyringe';
import { AuthenticationRepositoryImpl } from '../data/repository/AuthenticationRepositoryImpl';
import { AppDependencies } from './types';

export function registerRepositoryDependencies(): void {
  container.register(AppDependencies.AuthenticationRepository, {
    useClass: AuthenticationRepositoryImpl,
  });
}
