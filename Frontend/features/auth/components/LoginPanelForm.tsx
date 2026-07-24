import { FormEvent } from 'react';

import styles from './AuthPanel.module.css';
import AuthSocialLinks from './AuthSocialLinks';

type LoginPanelFormProps = {
  email: string;
  error: string;
  isSubmitting: boolean;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function LoginPanelForm({
  email,
  error,
  isSubmitting,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginPanelFormProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h1 className={styles.title}>Sign in JailMeet</h1>
      <AuthSocialLinks />
      <span className={styles.helperText}>or use your email & password</span>

      {error ? (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      ) : null}

      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        required
      />
      <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
        <span className={styles.buttonText}>
          <span className={styles.buttonTextOriginal}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </span>
          <span className={styles.buttonTextCopy} aria-hidden="true">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </span>
        </span>
      </button>
    </form>
  );
}