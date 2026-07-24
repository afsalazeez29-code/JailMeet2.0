import AuthPanel from '@features/auth/components/AuthPanel';
import SiteFooter from '../../components/common/SiteFooter';

export default function LoginPage() {
  return (
    <>
      <AuthPanel initialMode="login" />
      <SiteFooter />
    </>
  );
}
