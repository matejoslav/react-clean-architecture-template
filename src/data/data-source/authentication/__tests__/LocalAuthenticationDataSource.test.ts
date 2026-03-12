import 'reflect-metadata';
import { LocalStorageAuthenticationDataSource } from '../LocalAuthenticationDataSource';
import { LocalException } from '../../../../core/error/Exception';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string): string | null => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage });

describe('LocalStorageAuthenticationDataSource', () => {
  let dataSource: LocalStorageAuthenticationDataSource;

  beforeEach(() => {
    dataSource = new LocalStorageAuthenticationDataSource();
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveToken', () => {
    it('saves token to localStorage and returns true', async () => {
      const result = await dataSource.saveToken('my-token');

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth_token', 'my-token');
    });

    it('throws LocalException when localStorage.setItem fails', async () => {
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      await expect(dataSource.saveToken('my-token')).rejects.toBeInstanceOf(LocalException);
    });
  });

  describe('getToken', () => {
    it('returns token when it exists in localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValueOnce('stored-token');

      const result = await dataSource.getToken();

      expect(result).toBe('stored-token');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('auth_token');
    });

    it('throws LocalException when no token is stored', async () => {
      mockLocalStorage.getItem.mockReturnValueOnce(null);

      await expect(dataSource.getToken()).rejects.toBeInstanceOf(LocalException);
    });

    it('throws LocalException when localStorage.getItem fails', async () => {
      mockLocalStorage.getItem.mockImplementationOnce(() => {
        throw new Error('SecurityError');
      });

      await expect(dataSource.getToken()).rejects.toBeInstanceOf(LocalException);
    });
  });

  describe('removeToken', () => {
    it('removes token from localStorage', async () => {
      await dataSource.removeToken();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });
});
