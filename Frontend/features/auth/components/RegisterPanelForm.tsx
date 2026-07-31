import { FormEvent } from 'react';

import { VisitorRegistrationPayload } from '@features/auth/types';
import {
  NEW_PASSWORD_HELP,
  NEW_PASSWORD_MAX_LENGTH,
  NEW_PASSWORD_MIN_LENGTH,
} from '@features/auth/password-policy';

import styles from './AuthPanel.module.css';
import AuthSocialLinks from './AuthSocialLinks';

type RegisterPanelFormProps = {
  districts: string[];
  error: string;
  form: VisitorRegistrationPayload;
  isSubmitting: boolean;
  onFieldChange: (field: keyof VisitorRegistrationPayload, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function RegisterPanelForm({
  districts,
  error,
  form,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: RegisterPanelFormProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h1 className={styles.title}>Create JailMeet Account</h1>
      <AuthSocialLinks />
      <span className={styles.helperText}>or use your email for registration</span>

      {error ? (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      ) : null}

      <input
        className={styles.input}
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={(event) => onFieldChange('name', event.target.value)}
        required
      />
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(event) => onFieldChange('email', event.target.value)}
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
        value={form.phone}
        onChange={(event) =>
          onFieldChange('phone', event.target.value.replace(/\D/g, '').slice(0, 10))
        }
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        minLength={NEW_PASSWORD_MIN_LENGTH}
        maxLength={NEW_PASSWORD_MAX_LENGTH}
        aria-describedby="registration-password-help"
        value={form.password}
        onChange={(event) => onFieldChange('password', event.target.value)}
        required
      />
      <span className={styles.helperText} id="registration-password-help">
        {NEW_PASSWORD_HELP}
      </span>
      <select
        className={`${styles.input} ${styles.select}`}
        value={form.state}
        onChange={(event) => onFieldChange('state', event.target.value)}
        required
      >
        <option value="" disabled>
          Select district
        </option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
      <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
        <span className={styles.buttonText}>
          <span className={styles.buttonTextOriginal}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </span>
          <span className={styles.buttonTextCopy} aria-hidden="true">
            {isSubmitting ? 'Registering...' : 'Register'}
          </span>
        </span>
      </button>
    </form>
  );
}
