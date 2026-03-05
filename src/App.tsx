import { AuthProvider } from './presentation/context/AuthContext';
import { AppRouter } from './presentation/router/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
