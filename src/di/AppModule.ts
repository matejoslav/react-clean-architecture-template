import { container } from 'tsyringe';
import { registerDataDependencies } from './DataModule';
import { registerRepositoryDependencies } from './RepositoryModule';
import { registerUseCaseDependencies } from './UseCaseModule';

export function registerDependencies(): void {
  registerDataDependencies();
  registerRepositoryDependencies();
  registerUseCaseDependencies();
}

export { container };
