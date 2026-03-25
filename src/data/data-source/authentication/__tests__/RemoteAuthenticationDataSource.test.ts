import 'reflect-metadata';
import type { AxiosResponse } from 'axios';
import type { RemoteProvider } from '../../../../core/api/RemoteProvider';
import { RemoteException } from '../../../../core/error/Exception';
import type { SignInRequest, SignInResponse } from '../../../model/AuthenticationModels';
import {
  ApiAuthenticationDataSource,
  MockAuthenticationDataSource,
} from '../RemoteAuthenticationDataSource';

const mockProvider: jest.Mocked<RemoteProvider> = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const makeAxiosResponse = <T>(data: T): AxiosResponse<T> =>
  ({ data }) as AxiosResponse<T>;

describe('ApiAuthenticationDataSource', () => {
  let dataSource: ApiAuthenticationDataSource;

  const request: SignInRequest = { email: 'user@example.com', password: 'pass' };

  beforeEach(() => {
    dataSource = new ApiAuthenticationDataSource(mockProvider);
    jest.clearAllMocks();
  });

  it('calls provider.post with the correct URL and body', async () => {
    mockProvider.post.mockResolvedValueOnce(
      makeAxiosResponse<SignInResponse>({ token: 'abc123' }),
    );

    await dataSource.signIn(request);

    expect(mockProvider.post).toHaveBeenCalledWith('/api/login', request);
  });

  it('returns the sign-in response data', async () => {
    mockProvider.post.mockResolvedValueOnce(
      makeAxiosResponse<SignInResponse>({ token: 'abc123' }),
    );

    const result = await dataSource.signIn(request);

    expect(result).toEqual({ token: 'abc123' });
  });

  it('propagates errors thrown by the provider', async () => {
    mockProvider.post.mockRejectedValueOnce(new RemoteException(null, 'Network error'));

    await expect(dataSource.signIn(request)).rejects.toBeInstanceOf(RemoteException);
  });
});

describe('MockAuthenticationDataSource', () => {
  let dataSource: MockAuthenticationDataSource;

  beforeEach(() => {
    dataSource = new MockAuthenticationDataSource();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns a token for the valid email', async () => {
    const promise = dataSource.signIn({ email: 'user@example.com', password: 'anything' });
    jest.advanceTimersByTime(800);

    const result = await promise;

    expect(result.token).toMatch(/^mock-jwt-token-\d+$/);
  });

  it('throws RemoteException for an invalid email', async () => {
    const promise = dataSource.signIn({ email: 'wrong@example.com', password: 'anything' });
    jest.advanceTimersByTime(800);

    await expect(promise).rejects.toBeInstanceOf(RemoteException);
  });

  it('throws RemoteException with descriptive message for invalid email', async () => {
    const promise = dataSource.signIn({ email: 'wrong@example.com', password: 'anything' });
    jest.advanceTimersByTime(800);

    await expect(promise).rejects.toMatchObject({ message: 'Invalid email or password' });
  });
});
