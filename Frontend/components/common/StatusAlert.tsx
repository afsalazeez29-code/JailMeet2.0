import { ReactNode } from 'react';

type StatusAlertVariant = 'danger' | 'info' | 'success' | 'warning';

type StatusAlertProps = {
  children: ReactNode;
  className?: string;
  role?: 'alert' | 'status';
  variant: StatusAlertVariant;
};

export function StatusAlert({
  children,
  className = '',
  role,
  variant,
}: StatusAlertProps) {
  const classes = ['alert', `alert-${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role={role}>
      {children}
    </div>
  );
}

type PresetAlertProps = Omit<StatusAlertProps, 'variant'>;
type OptionalChildrenAlertProps = Omit<PresetAlertProps, 'children'> & { children?: ReactNode };

export function LoadingAlert(props: PresetAlertProps) {
  return <StatusAlert {...props} variant="info" />;
}

export function ErrorAlert(props: PresetAlertProps) {
  return <StatusAlert {...props} variant="danger" />;
}

export function ForbiddenAlert({
  children = 'Access denied',
  ...props
}: OptionalChildrenAlertProps) {
  return (
    <StatusAlert {...props} variant="danger">
      {children}
    </StatusAlert>
  );
}

export function EmptyStateAlert(props: PresetAlertProps) {
  return <StatusAlert {...props} variant="info" />;
}

export function SuccessAlert(props: PresetAlertProps) {
  return <StatusAlert {...props} variant="success" />;
}

export function WarningAlert(props: PresetAlertProps) {
  return <StatusAlert {...props} variant="warning" />;
}
