import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from 'react-icons/fa';

import styles from './AuthPanel.module.css';

export default function AuthSocialLinks() {
  return (
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
  );
}