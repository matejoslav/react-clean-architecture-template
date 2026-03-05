import { type FormEvent, useState } from 'react';
import { useSignIn } from './useSignIn';

export function SignInPage() {
  const { submit, isAuthenticating, error } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit({ email, password });
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Sign In</h1>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" disabled={isAuthenticating} style={styles.button}>
          {isAuthenticating ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={styles.hint}>
          Use <strong>user@example.com</strong> with any password
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '32px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: 0,
    textAlign: 'center',
    fontSize: '24px',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4a90d9',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    padding: '8px 12px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px',
    fontSize: '14px',
  },
  hint: {
    margin: 0,
    textAlign: 'center',
    fontSize: '12px',
    color: '#999',
  },
};
