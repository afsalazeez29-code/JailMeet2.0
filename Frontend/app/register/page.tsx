import AuthPanel from '@features/auth/components/AuthPanel';
import { parseAuthRole } from '@features/auth/services/navigation.service';
import SiteFooter from '../../components/common/SiteFooter';

type RegisterPageProps = {
  searchParams: Promise<{ role?: string | string[] }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { role } = await searchParams;
  const selectedRole = parseAuthRole(role) ?? 'VISITOR';
  const hasUnknownRole = role !== undefined && parseAuthRole(role) === null;

  return (
    <>
      <AuthPanel
        initialMode={hasUnknownRole ? 'login' : 'register'}
        selectedRole={selectedRole}
      />
      <SiteFooter />
    </>
  );
}
