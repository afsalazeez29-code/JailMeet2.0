import Link from 'next/link';
import { PiCopyright } from 'react-icons/pi';

import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer
      id="footer"
      className={`${styles.siteFooter} footer dark-background`}
    >
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <Link href="/" className="logo d-flex align-items-center">
              <img
                src="/legacy/logos/jmlogo.png"
                alt="JailMeet"
                className="footer-brand-logo"
              />
            </Link>
            <div className="footer-contact pt-3">
              <p>United States Penitentiary, Administrative Maximum Facility,</p>
              <p>USP Florence ADMAX-United States.</p>
              <p className="mt-3">
                <strong>Phone:</strong>
                <span>+1 8848 219595</span>
              </p>
              <p>
                <strong>Email:</strong>
                <span>jailmeet@gmail.com</span>
              </p>
            </div>
            <div className="social-links d-flex mt-4">
              <a
                href="https://x.com/"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://in.linkedin.com/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li>
                <i className="bi bi-chevron-right"></i>
                <Link href="/#hero">Home</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>
                <Link href="/#about">About us</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>
                <Link href="/#services">Services</Link>
              </li>
              <li>
                <i className="bi bi-chevron-right"></i>
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-6 col-md-12 footer-contact-boxes">
            <div className="footer-contact-grid">
              <div className="footer-contact-item footer-location">
                <i className="bi bi-geo-alt"></i>
                <h4>Location</h4>
                <p>
                  ADX Florence - 5880 State Highway 67, Florence, CO 81226,
                  United States.
                </p>
              </div>

              <div className="footer-contact-row">
                <div className="footer-contact-item">
                  <i className="bi bi-telephone"></i>
                  <h4>Call Us</h4>
                  <p>+1 8848 219595</p>
                </div>

                <div className="footer-contact-item">
                  <i className="bi bi-envelope"></i>
                  <h4>Email Us</h4>
                  <p>jailmeet@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p>
          <PiCopyright aria-hidden="true" className="d-inline-block" />{' '}
          <span>Copyright</span>{' '}
          <strong className="px-1 sitename">JailMeet</strong>{' '}
          <span>All Rights Reserved</span>
        </p>
        <div className="credits">
          Designed by{' '}
          <a
            href="https://github.com/afsalazeez29-code"
            target="_blank"
            rel="noopener noreferrer"
          >
            Afsal A Azeez
          </a>
        </div>
      </div>
    </footer>
  );
}
