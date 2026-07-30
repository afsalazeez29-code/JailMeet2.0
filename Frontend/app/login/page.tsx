import AuthPanel from '@features/auth/components/AuthPanel';
import { parseAuthRole } from '@features/auth/services/navigation.service';
import SiteFooter from '../../components/common/SiteFooter';

type LoginPageProps = {
  searchParams: Promise<{ role?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { role } = await searchParams;
  const selectedRole = parseAuthRole(role) ?? 'VISITOR';

  return (
    <>
      <AuthPanel initialMode="login" selectedRole={selectedRole} />
      <SiteFooter />
    </>
  );
}
