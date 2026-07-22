import AuthPanel from '../../components/auth/AuthPanel';
import SiteFooter from '../../components/common/SiteFooter';

export default function RegisterPage() {
  return (
    <>
      <AuthPanel initialMode="register" />
      <SiteFooter />
    </>
  );
}
