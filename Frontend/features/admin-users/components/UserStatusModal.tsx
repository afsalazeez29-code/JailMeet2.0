'use client';

import { AdminUser } from '@features/admin-users/types';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';

type UserStatusModalProps = {
  user: AdminUser | null;
  processing: boolean;
  onCancel: () => void;
  onConfirm: (user: AdminUser) => void;
};

export default function UserStatusModal({
  onCancel,
  onConfirm,
  processing,
  user,
}: UserStatusModalProps) {
  if (!user) {
    return null;
  }

  const action = user.isActive ? 'Deactivate' : 'Activate';

  return (
    <div className="modal d-block" role="dialog" style={{ background: 'rgba(0,0,0,.45)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{action} User</h5>
            <button className="close" disabled={processing} onClick={onCancel} type="button">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            Confirm {action.toLowerCase()} for <strong>{user.name || user.email}</strong>?
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" disabled={processing} onClick={onCancel} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" disabled={processing} onClick={() => onConfirm(user)} type="button">
              <AnimatedButtonText>{processing ? 'Processing...' : action}</AnimatedButtonText>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
