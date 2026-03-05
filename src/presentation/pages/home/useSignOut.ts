import { useCallback } from 'react';
import { container } from 'tsyringe';
import type { SignOutUseCase } from '../../../domain/use-case/authentication/SignOutUseCase';
import { Exception } from '../../../core/error/Exception';
import { AppDependencies } from '../../../di/types';
import { useAuthState, useAuthDispatch } from '../../context/AuthContext';

export function useSignOut() {
  const { isAuthenticating } = useAuthState();
  const dispatch = useAuthDispatch();

  const signOut = useCallback(async () => {
    dispatch({ type: 'SIGN_OUT_BEGIN' });
    try {
      const signOutUseCase = container.resolve<SignOutUseCase>(AppDependencies.SignOutUseCase);
      await signOutUseCase.call();
      dispatch({ type: 'SIGN_OUT_SUCCESS' });
    } catch (err) {
      const message = err instanceof Exception ? err.message
        : err instanceof Error ? err.message
        : 'Sign out failed';
      dispatch({ type: 'SIGN_OUT_FAILED', error: message });
    }
  }, [dispatch]);

  return { signOut, isSigningOut: isAuthenticating };
}
