'use client';

import { ErrorAlert, SuccessAlert } from '../../../components/common/StatusAlert';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

import { clearAccessToken } from '@features/auth/services/token.service';
import { changePassword } from '@features/auth/services/auth.service';
import { navigateToLoginAfterPasswordChange } from '@features/auth/services/navigation.service';
import { isApiServiceError } from '@/types/api';
import styles from './ChangePasswordForm.module.css';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';

type VisibilityField = 'current' | 'new' | 'confirm';

type ChangePasswordFormProps = {
  buttonClassName?: string;
};

export default function ChangePasswordForm({
  buttonClassName = "btn btn-primary"
}: ChangePasswordFormProps = {}) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState<Record<VisibilityField, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleVisibility = (field: VisibilityField) => {
    setVisible((current) => ({ ...current, [field]: !current[field] }));
  };

  const validate = (): string | null => {
    if (!currentPassword) return 'Current password is required';
    if (!newPassword) return 'New password is required';
    if (newPassword.length < 8) {
      return 'New password must contain at least 8 characters';
    }
    if (newPassword !== confirmPassword) return 'New passwords do not match';
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password changed. Please log in again.');
      clearAccessToken();
      navigateToLoginAfterPasswordChange(router);
    } catch (caughtError) {
      setError(
        isApiServiceError(caughtError)
          ? caughtError.message
          : 'Unable to change password',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const passwordInput = (
    field: VisibilityField,
    label: string,
    value: string,
    onChange: (value: string) => void,
  ) => (
    <div className="form-group">
      <label>{label}</label>
      <div className={styles.passwordRow}>
        <input
          className="form-control"
          onChange={(event) => onChange(event.target.value)}
          type={visible[field] ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={`${visible[field] ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          className={`btn ${styles.eyeButton}`}
          onClick={() => toggleVisibility(field)}
          type="button"
          aria-pressed={visible[field]}
        >
          {visible[field] ? (
            <EyeOff className={styles.eyeIcon} aria-hidden="true" />
          ) : (
            <Eye className={styles.eyeIcon} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.formShell}>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Change Password</h5>
        </div>
        <div className="card-body">
          {success ? <SuccessAlert>{success}</SuccessAlert> : null}
          {error ? <ErrorAlert>{error}</ErrorAlert> : null}
          <form onSubmit={handleSubmit}>
            {passwordInput('current', 'Current password', currentPassword, setCurrentPassword)}
            {passwordInput('new', 'New password', newPassword, setNewPassword)}
            {passwordInput('confirm', 'Confirm password', confirmPassword, setConfirmPassword)}
            <div className={styles.submitWrapper}>
              <button className={buttonClassName} disabled={submitting} type="submit">
                <AnimatedButtonText>{submitting ? 'Changing...' : 'Change Password'}</AnimatedButtonText>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




