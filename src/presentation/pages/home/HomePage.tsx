import { useSignOut } from './useSignOut';

export function HomePage() {
  const { signOut } = useSignOut();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>You are signed in.</p>
        <button onClick={signOut} style={styles.button}>
          Sign Out
        </button>
      </div>
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
  content: {
    textAlign: 'center',
    padding: '32px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginBottom: '24px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
