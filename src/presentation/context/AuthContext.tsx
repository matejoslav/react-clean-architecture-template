import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { container } from 'tsyringe';
import type { SignInUseCase } from '../../domain/use-case/authentication/SignInUseCase';
import { AppDependencies } from '../../di/types';

export interface AuthState {
  isAuthorized: boolean;
  isAuthenticating: boolean;
  isRestoringSession: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SIGN_IN_BEGIN' }
  | { type: 'SIGN_IN_SUCCESS' }
  | { type: 'SIGN_IN_FAILED'; error: string }
  | { type: 'SIGN_OUT_BEGIN' }
  | { type: 'SIGN_OUT_SUCCESS' }
  | { type: 'SIGN_OUT_FAILED'; error: string }
  | { type: 'RESTORE_SESSION_SUCCESS' }
  | { type: 'RESTORE_SESSION_FAILED' };

const initialState: AuthState = {
  isAuthorized: false,
  isAuthenticating: false,
  isRestoringSession: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGN_IN_BEGIN':
      return { ...state, isAuthenticating: true, error: null };
    case 'SIGN_IN_SUCCESS':
      return { isAuthorized: true, isAuthenticating: false, isRestoringSession: false, error: null };
    case 'SIGN_IN_FAILED':
      return { isAuthorized: false, isAuthenticating: false, isRestoringSession: false, error: action.error };
    case 'SIGN_OUT_BEGIN':
      return { ...state, isAuthenticating: true, error: null };
    case 'SIGN_OUT_SUCCESS':
      return { ...initialState, isRestoringSession: false };
    case 'SIGN_OUT_FAILED':
      return { ...state, isAuthenticating: false, error: action.error };
    case 'RESTORE_SESSION_SUCCESS':
      return { isAuthorized: true, isAuthenticating: false, isRestoringSession: false, error: null };
    case 'RESTORE_SESSION_FAILED':
      return { isAuthorized: false, isAuthenticating: false, isRestoringSession: false, error: null };
    default:
      return state;
  }
}

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<React.Dispatch<AuthAction> | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const signInUseCase = container.resolve<SignInUseCase>(AppDependencies.SignInUseCase);
        await signInUseCase.call();
        dispatch({ type: 'RESTORE_SESSION_SUCCESS' });
      } catch {
        dispatch({ type: 'RESTORE_SESSION_FAILED' });
      }
    };
    restoreSession();
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuthState(): AuthState {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
}

export function useAuthDispatch(): React.Dispatch<AuthAction> {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within an AuthProvider');
  }
  return context;
}
