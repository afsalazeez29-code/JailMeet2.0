'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FaChevronLeft, FaFacebookF, FaGooglePlusG, FaLinkedinIn } from 'react-icons/fa';

import { login, saveAccessToken } from '@/lib/auth';
import { registerVisitor } from '@/services/auth.service';
import { isApiServiceError } from '@/types/api';
import { Role, VisitorRegistrationPayload } from '@/types/auth';

import styles from './AuthPanel.module.css';

type AuthPanelProps = {
  initialMode: 'login' | 'register';
};

const roleRedirects: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  OFFICER: '/officer/dashboard',
  VISITOR: '/visitor/dashboard',
  PRISONER: '/prisoner/dashboard',
};

const keralaDistricts = [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad',
];

const initialRegisterForm: VisitorRegistrationPayload = {
  name: '',
  email: '',
  phone: '',
  password: '',
  state: '',
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return fallback;
};

const getRegistrationError = (error: unknown): string => {
  if (isApiServiceError(error)) {
    if (error.status === 409) {
      return 'Email already registered';
    }

    return error.message || 'Registration failed';
  }

  return 'Registration failed. Please check your connection and try again.';
};

export default function AuthPanel({ initialMode }: AuthPanelProps) {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(
    initialMode === 'register',
  );
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [registerForm, setRegisterForm] =
    useState<VisitorRegistrationPayload>(initialRegisterForm);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  const updateRegisterField = (
    field: keyof VisitorRegistrationPayload,
    value: string,
  ) => {
    setRegisterForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const validateRegisterForm = (): string | null => {
    if (!registerForm.name.trim()) {
      return 'Username is required';
    }

    if (!registerForm.email.trim()) {
      return 'Email is required';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email.trim())) {
      return 'Enter a valid email address';
    }

    if (!/^[0-9]{10}$/.test(registerForm.phone)) {
      return 'Invalid phone number! Enter exactly 10 digits.';
    }

    if (registerForm.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (!registerForm.state) {
      return 'District is required';
    }

    return null;
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setIsLoginSubmitting(true);

    try {
      const response = await login(loginEmail.trim(), loginPassword);

      if (!response.success || !response.data) {
        setLoginError(response.message || 'Login failed');
        return;
      }

      const { user, accessToken } = response.data;

      saveAccessToken(accessToken);
      router.push(roleRedirects[user.role]);
    } catch (caughtError) {
      setLoginError(getErrorMessage(caughtError, 'Login failed'));
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    const validationError = validateRegisterForm();

    if (validationError) {
      setRegisterError(validationError);
      return;
    }

    setIsRegisterSubmitting(true);

    try {
      await registerVisitor({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim(),
        password: registerForm.password,
        state: registerForm.state,
      });

      setRegisterSuccess(
        'Registration Successful! Redirecting to Login Page ...',
      );
      window.setTimeout(() => {
        router.push('/login');
      }, 1600);
    } catch (caughtError) {
      setRegisterError(getRegistrationError(caughtError));
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <section className={styles.authPage}>
      {registerSuccess ? (
        <div className={styles.successMessage}>{registerSuccess}</div>
      ) : null}

      <div
        className={`${styles.container} ${
          isRegisterMode ? styles.rightPanelActive : ''
        }`}
      >
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            <h1 className={styles.title}>Create JailMeet Account</h1>
            <div className={styles.socialContainer}>
              <a
                href="https://www.facebook.com/"
                className={styles.socialLink}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://myaccount.google.com/"
                className={styles.socialLink}
                aria-label="Google"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGooglePlusG />
              </a>
              <a
                href="https://www.linkedin.com/"
                className={styles.socialLink}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </div>
            <span className={styles.helperText}>
              or use your email for registration
            </span>

            {registerError ? (
              <div className={styles.errorMessage} role="alert">
                {registerError}
              </div>
            ) : null}

            <input
              className={styles.input}
              type="text"
              placeholder="Full Name"
              value={registerForm.name}
              onChange={(event) => updateRegisterField('name', event.target.value)}
              required
            />
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(event) =>
                updateRegisterField('email', event.target.value)
              }
              required
            />
            <input
              className={styles.input}
              type="tel"
              placeholder="Phone Number"
              inputMode="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              title="Enter a valid 10-digit phone number"
              value={registerForm.phone}
              onChange={(event) =>
                updateRegisterField(
                  'phone',
                  event.target.value.replace(/\D/g, '').slice(0, 10),
                )
              }
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(event) =>
                updateRegisterField('password', event.target.value)
              }
              required
            />
            <select
              className={`${styles.input} ${styles.select}`}
              value={registerForm.state}
              onChange={(event) => updateRegisterField('state', event.target.value)}
              required
            >
              <option value="" disabled>
                Select district
              </option>
              {keralaDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <button
              className={styles.primaryButton}
              type="submit"
              disabled={isRegisterSubmitting}
            >
              <span className={styles.buttonText}>
                <span className={styles.buttonTextOriginal}>
                  {isRegisterSubmitting ? 'Registering...' : 'Register'}
                </span>
                <span className={styles.buttonTextCopy} aria-hidden="true">
                  {isRegisterSubmitting ? 'Registering...' : 'Register'}
                </span>
              </span>
            </button>
          </form>
        </div>

        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <button
            className={`${styles.outlineButton} ${styles.goBackButton}`}
            type="button"
            onClick={goHome}
          >
            <FaChevronLeft className={styles.goBackIcon} aria-hidden="true" />
            <span className={styles.buttonText}>
              <span className={styles.buttonTextOriginal}>Go Back</span>
              <span className={styles.buttonTextCopy} aria-hidden="true">
                Go Back
              </span>
            </span>
          </button>

          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <h1 className={styles.title}>Sign in JailMeet</h1>
            <div className={styles.socialContainer}>
              <a
                href="https://www.facebook.com/"
                className={styles.socialLink}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://myaccount.google.com/"
                className={styles.socialLink}
                aria-label="Google"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGooglePlusG />
              </a>
              <a
                href="https://www.linkedin.com/"
                className={styles.socialLink}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </div>
            <span className={styles.helperText}>
              or use your email & password
            </span>

            {loginError ? (
              <div className={styles.errorMessage} role="alert">
                {loginError}
              </div>
            ) : null}

            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              required
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              required
            />
            <button
              className={styles.primaryButton}
              type="submit"
              disabled={isLoginSubmitting}
            >
              <span className={styles.buttonText}>
                <span className={styles.buttonTextOriginal}>
                  {isLoginSubmitting ? 'Logging in...' : 'Login'}
                </span>
                <span className={styles.buttonTextCopy} aria-hidden="true">
                  {isLoginSubmitting ? 'Logging in...' : 'Login'}
                </span>
              </span>
            </button>
          </form>
        </div>

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <button
                className={`${styles.outlineButton} ${styles.registerBackButton}`}
                type="button"
                aria-label="Go back to landing page"
                onClick={goHome}
              >
                <FaChevronLeft
                  className={styles.registerBackIcon}
                  aria-hidden="true"
                />
                <span className={styles.buttonText}>
                  <span className={styles.buttonTextOriginal}>Go Back</span>
                  <span className={styles.buttonTextCopy} aria-hidden="true">
                    Go Back
                  </span>
                </span>
              </button>
              <Link href="/" aria-label="Go to JailMeet landing page">
                <img
                  src="/images/logos/auth-logo.png"
                  alt="JailMeet logo"
                  className={styles.overlayLogo}
                />
              </Link>
              <h1 className={styles.overlayTitle}>Welcome Back to JailMeet !</h1>
              <p className={styles.overlayCopy}>
                login to manage appointments and stay connected with your loved
                ones.
              </p>
              <button
                className={styles.outlineButton}
                type="button"
                onClick={() => setIsRegisterMode(false)}
              >
                <span className={styles.buttonText}>
                  <span className={styles.buttonTextOriginal}>Login</span>
                  <span className={styles.buttonTextCopy} aria-hidden="true">
                    Login
                  </span>
                </span>
              </button>
            </div>

            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <Link href="/" aria-label="Go to JailMeet landing page">
                <img
                  src="/images/logos/auth-logo.png"
                  alt="JailMeet logo"
                  className={styles.overlayLogo}
                />
              </Link>
              <h1 className={styles.overlayTitle}>Welcome to JailMeet !</h1>
              <p className={styles.overlayCopy}>
                create your account and stay connected with your loved ones.
              </p>
              <button
                className={styles.outlineButton}
                type="button"
                onClick={() => setIsRegisterMode(true)}
              >
                <span className={styles.buttonText}>
                  <span className={styles.buttonTextOriginal}>Register</span>
                  <span className={styles.buttonTextCopy} aria-hidden="true">
                    Register
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.mobileSwitch}>
          <button
            className={styles.mobileSwitchButton}
            type="button"
            onClick={() => setIsRegisterMode(false)}
            aria-pressed={!isRegisterMode}
          >
            Login
          </button>
          <button
            className={styles.mobileSwitchButton}
            type="button"
            onClick={() => setIsRegisterMode(true)}
            aria-pressed={isRegisterMode}
          >
            Register
          </button>
        </div>
      </div>
    </section>
  );
}
