'use client';

import { AdminUser } from '@features/admin-users/types';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';
import { useEffect, useState } from 'react';
import { getAdminUserDeactivationImpact } from '@features/admin-users/services/admin-users.service';

type UserStatusModalProps = {
  user: AdminUser | null;
  processing: boolean;
  onCancel: () => void;
  onConfirm: (user: AdminUser, reason: string, confirmation: string) => void;
};

export default function UserStatusModal({
  onCancel,
  onConfirm,
  processing,
  user,
}: UserStatusModalProps) {
  const [reason, setReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [impact, setImpact] = useState<{ warning: string; effects: Record<string, number> } | null>(null);
  useEffect(() => { setReason(''); setConfirmation(''); setImpact(null); if (user?.isActive) void getAdminUserDeactivationImpact(user.accountReference).then(setImpact).catch(() => setImpact({ warning: 'Impact preview is unavailable; do not continue until the account is reviewed.', effects: {} })); }, [user]);
  if (!user) {
    return null;
  }

  const action = user.isActive ? 'Deactivate' : 'Activate';
  const expected = `${action.toUpperCase()} ${user.accountReference}`;

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
            <p>Confirm {action.toLowerCase()} for <strong>{user.name || user.email}</strong>. Historical records are preserved.</p>
            {user.isActive ? <div className="alert alert-warning"><strong>Impact:</strong> {impact?.warning ?? 'Loading impact preview…'}{impact ? <ul className="mb-0 mt-2">{Object.entries(impact.effects).map(([key,value]) => <li key={key}>{key.replace(/([A-Z])/g, ' $1')}: {value}</li>)}</ul> : null}</div> : null}
            <label className="form-label" htmlFor="status-reason">Operational reason</label>
            <textarea className="form-control mb-3" id="status-reason" maxLength={500} minLength={10} onChange={(event) => setReason(event.target.value)} required value={reason} />
            <label className="form-label" htmlFor="status-confirmation">Type <code>{expected}</code></label>
            <input className="form-control" id="status-confirmation" onChange={(event) => setConfirmation(event.target.value)} required value={confirmation} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" disabled={processing} onClick={onCancel} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" disabled={processing || (user.isActive && !impact) || reason.trim().length < 10 || confirmation !== expected} onClick={() => onConfirm(user, reason.trim(), confirmation)} type="button">
              <AnimatedButtonText>{processing ? 'Processing...' : action}</AnimatedButtonText>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
