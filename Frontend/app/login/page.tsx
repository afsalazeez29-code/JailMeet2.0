import Link from 'next/link';

import LoginForm from '../../components/auth/LoginForm';
import SiteFooter from '../../components/common/SiteFooter';

export default function LoginPage() {
  return (
    <>
      <LoginForm
        title={
          <>
            Log-in to{' '}
            <Link
              href="/"
              className="auth-title-logo-link"
              aria-label="Go to JailMeet landing page"
            >
              <img
                src="/legacy/logos/jmlogo.png"
                alt="JailMeet"
                className="auth-title-logo"
              />
            </Link>
          </>
        }
      />
      <SiteFooter />
    </>
  );
}
