import { useState } from 'react';
import Header from '../_components/Header';
import Footer from '../_components/Footer';
import { useAuth } from '../_lib/AuthManager';
import IfAuth from '../_components/IfAuth';
import { Navigate, useNavigate, useNavigation } from 'react-router-dom';

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <>
      <Header />

      <main className="d-flex flex-column align-items-center justify-content-center gap-3">
        <IfAuth
          content ={(auth) => <Navigate to="/map" replace />}
          loadingContent={<p>Loading...</p>}
          noAuthContent={(
            <>
              <h1>
                {formType === 'login' ? 'Log in' : 'Register'}
              </h1>

              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (formType === 'login') {
                    await auth.login(username, password);
                  } else {
                    await auth.register(username, password);
                    await auth.login(username, password);
                  }
                  navigate('/map');
                } catch (err: any) {
                  setErrorMsg(err.message);
                }
              }}>
                <div>
                  <label htmlFor="new-username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="new-username"
                    name="new-username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className="form-label">Password</label>
                  <input
                    type="password"
                    autoComplete={formType === 'register' ? 'new-password' : 'current-password'}
                    id="new-password"
                    name="new-password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {errorMsg && <p className="text-danger mt-2">{errorMsg}</p>}

                <button type="submit" className="btn btn-primary mt-3 w-100">
                  {formType === 'login' ? 'Log In' : 'Register'}
                </button>
              </form>

              <p className="mt-3 text-center">
                {formType === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  className="btn btn-link p-0"
                  onClick={() => {
                    setErrorMsg(null);
                    setFormType(formType === 'login' ? 'register' : 'login')
                  }}
                >
                  {formType === 'login' ? 'Register' : 'Log In'}
                </button>
              </p>
            </>
          )}
        />
      </main>

      <Footer />
    </>
  )
}