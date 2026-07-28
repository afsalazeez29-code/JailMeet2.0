import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';

import s from './DashboardFooter.module.css';

export default function DashboardFooter() {
  return (
    <footer className={s.dashboardFooter} aria-label="Dashboard footer">
      <div className={s.inner}>
        <div className={s.socials}>
          <a
            href="https://x.com/"
            aria-label="Twitter"
            className={s.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter aria-hidden="true" />
          </a>
          <a
            href="https://www.facebook.com/"
            aria-label="Facebook"
            className={s.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/"
            aria-label="Instagram"
            className={s.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram aria-hidden="true" />
          </a>
          <a
            href="https://in.linkedin.com/"
            aria-label="LinkedIn"
            className={s.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn aria-hidden="true" />
          </a>
        </div>

        <p className={s.copyright}>
          &copy; Copyright <strong>JailMeet</strong> All Rights Reserved
        </p>

        <p className={s.designer}>
          Designed by{' '}
          <a
            href="https://github.com/afsalazeez29-code"
            className={s.designerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Afsal A Azeez
          </a>
        </p>
      </div>
    </footer>
  );
}
