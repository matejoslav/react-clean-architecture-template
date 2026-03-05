import { AuthenticationRepositoryImpl } from '../AuthenticationRepositoryImpl';
import type { RemoteAuthenticationDataSource } from '../../data-source/authentication/RemoteAuthenticationDataSource';
import type { LocalAuthenticationDataSource } from '../../data-source/authentication/LocalAuthenticationDataSource';
import { RemoteException, LocalException } from '../../../core/error/Exception';

describe('AuthenticationRepositoryImpl', () => {
  let repository: AuthenticationRepositoryImpl;
  let remoteDataSource: jest.Mocked<RemoteAuthenticationDataSource>;
  let localDataSource: jest.Mocked<LocalAuthenticationDataSource>;

  beforeEach(() => {
    remoteDataSource = {
      signIn: jest.fn(),
    };
    localDataSource = {
      saveToken: jest.fn(),
      getToken: jest.fn(),
      removeToken: jest.fn(),
    };
    repository = new AuthenticationRepositoryImpl(remoteDataSource, localDataSource);
  });

  describe('signIn', () => {
    const credential = { email: 'user@example.com', password: 'password123' };

    it('returns sign-in result with fromLocal false on success', async () => {
      remoteDataSource.signIn.mockResolvedValue({ token: 'test-token' });

      const result = await repository.signIn(credential);

      expect(remoteDataSource.signIn).toHaveBeenCalledWith(credential);
      expect(result).toEqual({ token: 'test-token', fromLocal: false });
    });

    it('propagates RemoteException on failure', async () => {
      remoteDataSource.signIn.mockRejectedValue(
        new RemoteException(null, 'Invalid credentials'),
      );

      await expect(repository.signIn(credential)).rejects.toBeInstanceOf(RemoteException);
    });
  });

  describe('getToken', () => {
    it('returns token from local data source', async () => {
      localDataSource.getToken.mockResolvedValue('stored-token');

      const result = await repository.getToken();

      expect(localDataSource.getToken).toHaveBeenCalled();
      expect(result).toBe('stored-token');
    });

    it('propagates LocalException when no token found', async () => {
      localDataSource.getToken.mockRejectedValue(
        new LocalException('No token found'),
      );

      await expect(repository.getToken()).rejects.toBeInstanceOf(LocalException);
    });
  });

  describe('saveToken', () => {
    it('returns true on success', async () => {
      localDataSource.saveToken.mockResolvedValue(true);

      const result = await repository.saveToken('new-token');

      expect(localDataSource.saveToken).toHaveBeenCalledWith('new-token');
      expect(result).toBe(true);
    });

    it('propagates LocalException on failure', async () => {
      localDataSource.saveToken.mockRejectedValue(
        new LocalException('Storage error'),
      );

      await expect(repository.saveToken('new-token')).rejects.toBeInstanceOf(LocalException);
    });
  });

  describe('removeToken', () => {
    it('delegates to local data source', async () => {
      localDataSource.removeToken.mockResolvedValue();

      await repository.removeToken();

      expect(localDataSource.removeToken).toHaveBeenCalled();
    });

    it('propagates LocalException on failure', async () => {
      localDataSource.removeToken.mockRejectedValue(
        new LocalException('Remove failed'),
      );

      await expect(repository.removeToken()).rejects.toBeInstanceOf(LocalException);
    });
  });
});
