'use client';

import { FormEvent, useState } from 'react';

import { OfficerParoleRequest, ReviewParoleRequestInput } from '@/types/parole';

type ParoleReviewModalProps = {
  request: OfficerParoleRequest | null;
  action: ReviewParoleRequestInput['status'] | null;
  processing: boolean;
  onClose: () => void;
  onSubmit: (
    request: OfficerParoleRequest,
    payload: ReviewParoleRequestInput,
  ) => void;
};

export default function ParoleReviewModal({
  action,
  onClose,
  onSubmit,
  processing,
  request,
}: ParoleReviewModalProps) {
  const [replyMessage, setReplyMessage] = useState('');

  if (!request || !action) {
    return null;
  }

  const actionLabel = action === 'ACCEPTED' ? 'Approve' : 'Reject';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(request, {
      status: action,
      replyMessage: replyMessage.trim() || undefined,
    });
  };

  return (
    <div
      className="modal d-block"
      role="dialog"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      tabIndex={-1}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{actionLabel} Parole Request</h5>
              <button
                aria-label="Close"
                className="close"
                disabled={processing}
                onClick={onClose}
                type="button"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="mb-2">
                <strong>Prisoner:</strong> {request.prisoner.name}
              </p>
              <p className="mb-2">
                <strong>Purpose:</strong> {request.purpose}
              </p>
              <div className="form-group mb-0">
                <label htmlFor="replyMessage">Officer Reply</label>
                <textarea
                  className="form-control"
                  disabled={processing}
                  id="replyMessage"
                  maxLength={1000}
                  onChange={(event) => setReplyMessage(event.target.value)}
                  placeholder="Optional reply visible to prisoner"
                  rows={4}
                  value={replyMessage}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                disabled={processing}
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`btn ${
                  action === 'ACCEPTED' ? 'btn-success' : 'btn-danger'
                }`}
                disabled={processing}
                type="submit"
              >
                {processing ? 'Processing...' : actionLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
