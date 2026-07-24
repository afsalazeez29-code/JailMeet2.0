'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

import { login, saveAccessToken } from '@features/auth/services/token.service';
import { registerVisitor } from '@features/auth/services/auth.service';
import {
  navigateToHome,
  navigateToLogin,
  navigateToRoleDashboard,
} from '@features/auth/services/navigation.service';
import { isApiServiceError } from '@/types/api';
import { VisitorRegistrationPayload } from '@features/auth/types';

import styles from './AuthPanel.module.css';
import AuthMobileSwitch from './AuthMobileSwitch';
import AuthOverlay from './AuthOverlay';
import LoginPanelForm from './LoginPanelForm';
import RegisterPanelForm from './RegisterPanelForm';

type AuthPanelProps = {
  initialMode: 'login' | 'register';
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

  const showLogin = () => setIsRegisterMode(false);
  const showRegister = () => setIsRegisterMode(true);

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
      navigateToRoleDashboard(router, user.role);
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
        navigateToLogin(router, 'push');
      }, 1600);
    } catch (caughtError) {
      setRegisterError(getRegistrationError(caughtError));
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const goHome = () => {
    navigateToHome(router);
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
          <RegisterPanelForm
            districts={keralaDistricts}
            error={registerError}
            form={registerForm}
            isSubmitting={isRegisterSubmitting}
            onFieldChange={updateRegisterField}
            onSubmit={handleRegisterSubmit}
          />
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

          <LoginPanelForm
            email={loginEmail}
            error={loginError}
            isSubmitting={isLoginSubmitting}
            password={loginPassword}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={handleLoginSubmit}
          />
        </div>

        <AuthOverlay
          onGoHome={goHome}
          onShowLogin={showLogin}
          onShowRegister={showRegister}
        />

        <AuthMobileSwitch
          isRegisterMode={isRegisterMode}
          onShowLogin={showLogin}
          onShowRegister={showRegister}
        />
      </div>
    </section>
  );
}