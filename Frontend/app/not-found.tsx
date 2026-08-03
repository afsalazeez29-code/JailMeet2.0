import ErrorPage from '@features/auth/components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      message="The page you are looking for does not exist or may have moved."
      primaryAction={{ href: '/', label: 'Return to Home', kind: 'home' }}
    />
  );
}
