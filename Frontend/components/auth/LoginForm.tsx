'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { login, saveAccessToken } from '@/lib/auth';
import { Role } from '@/types/auth';

type LoginFormProps = {
  expectedRole?: Role;
  title: string;
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

      <footer id="footer" className="footer dark-background">
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about">
              <Link href="/" className="logo d-flex align-items-center">
                <span className="sitename">Dewi</span>
              </Link>
              <div className="footer-contact pt-3">
                <p>A108 Adam Street</p>
                <p>New York, NY 535022</p>
                <p className="mt-3">
                  <strong>Phone:</strong> <span>+1 5589 55488 55</span>
                </p>
                <p>
                  <strong>Email:</strong> <span>info@example.com</span>
                </p>
              </div>
              <div className="social-links d-flex mt-4">
                <a href="">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <i className="bi bi-chevron-right"></i> <a href="#">Home</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">About us</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Services</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Terms of service</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Privacy policy</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Web Design</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Web Development</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Product Management</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Marketing</a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{' '}
                  <a href="#">Graphic Design</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-12 footer-newsletter">
              <h4>Our Newsletter</h4>
              <p>
                Subscribe to our newsletter and receive the latest news about
                our products and services!
              </p>
              <form>
                <div className="newsletter-form">
                  <input type="email" name="email" />
                  <input type="submit" value="Subscribe" />
                </div>
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">
                  Your subscription request has been sent. Thank you!
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="container copyright text-center mt-4">
          <p>
            Â© <span>Copyright</span> <span>All Rights Reserved</span>
          </p>
          <div className="credits">
            Designed by <Link href="/">JailMeet</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


