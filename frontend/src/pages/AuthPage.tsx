import { useState } from 'react';
import { login, register } from '../api';

export function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
        await login(email, password);
      }
      onAuth();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-section">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
      <div className="auth-toggle">
        {isLogin ? (
          <>No account? <span onClick={() => setIsLogin(false)}>Register</span></>
        ) : (
          <>Have an account? <span onClick={() => setIsLogin(true)}>Login</span></>
        )}
      </div>
    </div>
  );
}
