import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from '../context/AuthContext';
import { SignInPage } from '../pages/sign-in/SignInPage';
import { HomePage } from '../pages/home/HomePage';

function AuthGate() {
  const { isAuthorized, isRestoringSession } = useAuthState();

  if (isRestoringSession) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes key={isAuthorized ? 'authorized' : 'unauthorized'}>
      {isAuthorized ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </>
      )}
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthGate />
    </BrowserRouter>
  );
}
