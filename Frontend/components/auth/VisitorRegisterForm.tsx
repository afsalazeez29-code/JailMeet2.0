'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { registerVisitor } from '@/services/auth.service';
import { isApiServiceError } from '@/types/api';
import { VisitorRegistrationPayload } from '@/types/auth';

import LandingAssets from '../legacy/landing/LandingAssets';
import styles from './VisitorRegisterForm.module.css';

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

const initialFormState: VisitorRegistrationPayload = {
  name: '',
  email: '',
  phone: '',
  password: '',
  address: '',
  state: '',
  zip: '',
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

export default function VisitorRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] =
    useState<VisitorRegistrationPayload>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateField = (
    field: keyof VisitorRegistrationPayload,
    value: string,
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Username is required';
    }

    if (!formData.email.trim()) {
      return 'Email is required';
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return 'Invalid phone number! Enter exactly 10 digits.';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (!formData.state) {
      return 'District is required';
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await registerVisitor({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        address: formData.address,
        state: formData.state,
        zip: formData.zip,
      });

      setSuccessMessage(
        'Registration Successful! Redirecting to Login Page ...',
      );
      window.setTimeout(() => {
        router.push('/login');
      }, 1600);
    } catch (caughtError) {
      setError(getRegistrationError(caughtError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <LandingAssets />

      {successMessage ? (
        <div className={styles.success}>{successMessage}</div>
      ) : null}

      <main className="main">
        <section
          id="hero"
          className={`hero section dark-background ${styles.hero}`}
        >
          <img
            src="/legacy/landing/prison1.jpg"
            alt=""
            className={styles.heroImage}
          />

          <div
            className={`container d-flex flex-column align-items-center ${styles.content}`}
          >
            <h2 className={styles.title}>Register for an Account</h2>
            <p className={styles.subtitle}>
              "Book appointments easily to visit and stay connected with your
              loved ones in prison."
            </p>

            {error ? (
              <div className={`${styles.alert} ${styles.error}`} role="alert">
                {error}
              </div>
            ) : null}

            <div className={`register-form mt-4 ${styles.registerForm}`}>
              <form onSubmit={handleSubmit}>
                <div className={`mb-3 ${styles.field}`}>
                  <label htmlFor="name" className={`form-label ${styles.label}`}>
                    Username:
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className={`form-control ${styles.input}`}
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    required
                  />
                </div>

                <div className={`mb-3 ${styles.field}`}>
                  <label
                    htmlFor="email"
                    className={`form-label ${styles.label}`}
                  >
                    Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className={`form-control ${styles.input}`}
                    value={formData.email}
                    onChange={(event) =>
                      updateField('email', event.target.value)
                    }
                    required
                  />
                </div>

                <div className={`mb-3 ${styles.field}`}>
                  <label
                    htmlFor="phone"
                    className={`form-label ${styles.label}`}
                  >
                    Phone Number:
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className={`form-control ${styles.input}`}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Enter a valid 10-digit phone number"
                    value={formData.phone}
                    onChange={(event) =>
                      updateField(
                        'phone',
                        event.target.value.replace(/\D/g, '').slice(0, 10),
                      )
                    }
                    required
                  />
                  {formData.phone && formData.phone.length !== 10 ? (
                    <small className={styles.phoneHelp}>
                      Only 10 digits allowed!
                    </small>
                  ) : null}
                </div>

                <div className={`mb-3 ${styles.field}`}>
                  <label
                    htmlFor="password"
                    className={`form-label ${styles.label}`}
                  >
                    Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className={`form-control ${styles.input}`}
                    value={formData.password}
                    onChange={(event) =>
                      updateField('password', event.target.value)
                    }
                    required
                  />
                </div>

                <div className={`mb-3 ${styles.field}`}>
                  <label
                    htmlFor="state"
                    className={`form-label ${styles.label}`}
                  >
                    District (Kerala):
                  </label>
                  <select
                    id="state"
                    name="state"
                    className={`form-control ${styles.input}`}
                    value={formData.state}
                    onChange={(event) =>
                      updateField('state', event.target.value)
                    }
                    required
                  >
                    <option value="">Select District</option>
                    {keralaDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  name="register_btn"
                  className={`btn btn-primary w-100 ${styles.button}`}
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <p className={`mt-3 ${styles.helper}`}>
                Already have an account?{' '}
                <Link href="/login" className={styles.link}>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
