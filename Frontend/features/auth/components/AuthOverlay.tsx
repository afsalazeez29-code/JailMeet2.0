import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import iconStyles from '../../../components/common/LucideIcon.module.css';

import styles from './AuthPanel.module.css';

type AuthOverlayProps = {
  canRegister: boolean;
  onGoHome: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
};

export default function AuthOverlay({
  canRegister,
  onGoHome,
  onShowLogin,
  onShowRegister,
}: AuthOverlayProps) {
  return (
    <div className={styles.overlayContainer}>
      <div className={styles.overlay}>
        <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
          <button
            className={`${styles.outlineButton} ${styles.registerBackButton}`}
            type="button"
            aria-label="Go back to landing page"
            onClick={onGoHome}
          >
            <ChevronLeft
              className={`${iconStyles.icon} ${iconStyles.action} ${styles.registerBackIcon}`}
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
          <h1 className={styles.overlayTitle}>Welcome Back to JailMeet</h1>
          <p className={styles.overlayCopy}>
            login to manage appointments and stay connected with your loved ones.
          </p>
          <button className={styles.outlineButton} type="button" onClick={onShowLogin}>
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
          <h1 className={styles.overlayTitle}>Welcome to JailMeet</h1>
          <p className={styles.overlayCopy}>
            create your account and stay connected with your loved ones.
          </p>
          <button
            className={styles.outlineButton}
            type="button"
            onClick={onShowRegister}
            disabled={!canRegister}
            aria-disabled={!canRegister}
            tabIndex={canRegister ? 0 : -1}
          >
            <span className={styles.buttonText}>
              <span className={styles.buttonTextOriginal}>Register</span>
              <span className={styles.buttonTextCopy} aria-hidden="true">
                Register
              </span>
            </span>
          </button>
          {!canRegister ? (
            <p className={styles.registrationDisabledMessage}>
              Registration is managed by Admin.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
