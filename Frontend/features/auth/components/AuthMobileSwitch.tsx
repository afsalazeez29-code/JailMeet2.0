import styles from './AuthPanel.module.css';

type AuthMobileSwitchProps = {
  isRegisterMode: boolean;
  onShowLogin: () => void;
  onShowRegister: () => void;
};

export default function AuthMobileSwitch({
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
      >
        Register
      </button>
    </div>
  );
}