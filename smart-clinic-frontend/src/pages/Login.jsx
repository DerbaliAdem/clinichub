import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem(
        'accessToken',
        response.data.accessToken,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user),
      );

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      if (error.response?.data?.message) {
        setError(
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message,
        );
      } else {
        setError('Unable to connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="hidden w-1/2 flex-col justify-between bg-blue-600 p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-blue-600">
              CH
            </div>

            <span className="text-xl font-bold">
              ClinicHub
            </span>
          </div>
        </div>

        <div className="max-w-lg">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-blue-100">
            Clinic Management System
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Manage your clinic with confidence.
          </h1>

          <p className="mt-6 text-lg leading-8 text-blue-100">
            Manage doctors, patients, and appointments from
            one simple and organized platform.
          </p>
        </div>

        <p className="text-sm text-blue-200">
          ClinicHub Management System
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-100 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              CH
            </div>

            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              ClinicHub
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Clinic Management System
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to access your clinic dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            © 2026 ClinicHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;