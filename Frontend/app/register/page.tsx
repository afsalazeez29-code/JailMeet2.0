import AuthPanel from '@features/auth/components/AuthPanel';
import SiteFooter from '../../components/common/SiteFooter';

export default function RegisterPage() {
  return (
    <>
      <AuthPanel initialMode="register" />
      <SiteFooter />
    </>
  );
}
