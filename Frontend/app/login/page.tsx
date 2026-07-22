import AuthPanel from '../../components/auth/AuthPanel';
import SiteFooter from '../../components/common/SiteFooter';

export default function LoginPage() {
  return (
    <>
      <AuthPanel initialMode="login" />
      <SiteFooter />
    </>
  );
}
