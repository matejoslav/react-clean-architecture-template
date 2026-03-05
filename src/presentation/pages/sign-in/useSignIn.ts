import { useCallback } from 'react';
import { container } from 'tsyringe';
import type { Credential } from '../../../domain/entity/Authentication';
import type { SignInUseCase } from '../../../domain/use-case/authentication/SignInUseCase';
import { Exception } from '../../../core/error/Exception';
import { AppDependencies } from '../../../di/types';
import { useAuthState, useAuthDispatch } from '../../context/AuthContext';

export function useSignIn() {
  const { isAuthenticating, error } = useAuthState();
  const dispatch = useAuthDispatch();

  const submit = useCallback(async (credential: Credential) => {
    dispatch({ type: 'SIGN_IN_BEGIN' });
    try {
      const signInUseCase = container.resolve<SignInUseCase>(AppDependencies.SignInUseCase);
      await signInUseCase.call(credential);
      dispatch({ type: 'SIGN_IN_SUCCESS' });
    } catch (err) {
      const message = err instanceof Exception ? err.message
        : err instanceof Error ? err.message
        : 'Sign in failed';
      dispatch({ type: 'SIGN_IN_FAILED', error: message });
    }
  }, [dispatch]);

  return { submit, isAuthenticating, error };
}
