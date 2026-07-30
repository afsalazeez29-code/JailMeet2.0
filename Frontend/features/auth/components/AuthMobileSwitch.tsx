import styles from './AuthPanel.module.css';

type AuthMobileSwitchProps = {
  canRegister: boolean;
  isRegisterMode: boolean;
  onShowLogin: () => void;
  onShowRegister: () => void;
};

export default function AuthMobileSwitch({
  canRegister,
  isRegisterMode,
  onShowLogin,
  onShowRegister,
}: AuthMobileSwitchProps) {
  return (
    <div className={styles.mobileSwitch}>
      <button
        className={styles.mobileSwitchButton}
        type="button"
        onClick={onShowLogin}
        aria-pressed={!isRegisterMode}
      >
        Login
      </button>
      <button
        className={styles.mobileSwitchButton}
        type="button"
        onClick={onShowRegister}
        aria-pressed={isRegisterMode}
        disabled={!canRegister}
        aria-disabled={!canRegister}
        tabIndex={canRegister ? 0 : -1}
      >
        Register
      </button>
    </div>
  );
}
