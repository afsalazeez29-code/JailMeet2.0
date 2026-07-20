'use client';

import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { login, saveAccessToken } from '@/lib/auth';
import { Role } from '@/types/auth';

type LoginFormProps = {
  expectedRole?: Role;
  title: ReactNode;
};

const roleRedirects: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  OFFICER: '/officer/dashboard',
  VISITOR: '/visitor/dashboard',
  PRISONER: '/prisoner/dashboard',
};

const getErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'Login failed';
};

export default function LoginForm({ expectedRole, title }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);

      if (!response.success || !response.data) {
        setError(response.message || 'Login failed');
        return;
      }

      const { user, accessToken } = response.data;

      saveAccessToken(accessToken);

      if (expectedRole && user.role !== expectedRole) {
        setError(`This login page is only for ${expectedRole.toLowerCase()}.`);
        return;
      }

      router.push(roleRedirects[user.role]);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <link
        href="/legacy/landing/assets/vendor/bootstrap-icons/bootstrap-icons.css"
        rel="stylesheet"
      />
      <main className="main">
        <section id="hero" className="hero section dark-background">
          <img src="/legacy/landing/prison1.jpg" alt="" />

          <div className="container d-flex flex-column align-items-center">
            <h2>{title}</h2>
            <p>
              "Book appointments easily to visit and stay connected with your
              loved ones in prison."
            </p>

            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : null}

            <div className="login-form mt-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  name="login_btn"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p className="mt-3">
                Don&apos;t have an account? <Link href="/register">Register</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}


