'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { clearAccessToken } from '@features/auth/services/token.service';
import { reviewParoleRequest } from '@features/parole/services/parole.service';
import { isApiServiceError } from '@/types/api';
import {
  OfficerParoleRequest,
  ReviewParoleRequestInput,
} from '@features/parole/types';
import ParoleReviewModal from './ParoleReviewModal';

type OfficerParoleListProps = {
  requests: OfficerParoleRequest[];
  onReviewed: (request: OfficerParoleRequest) => void;
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value));

const formatDateTime = (value: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function OfficerParoleList({
  onReviewed,
  requests,
}: OfficerParoleListProps) {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] =
    useState<OfficerParoleRequest | null>(null);
  const [selectedAction, setSelectedAction] =
    useState<ReviewParoleRequestInput['status'] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const openReview = (
    request: OfficerParoleRequest,
    action: ReviewParoleRequestInput['status'],
  ) => {
    setSelectedRequest(request);
    setSelectedAction(action);
    setError(null);
    setSuccess(null);
  };

  const closeReview = () => {
    if (processing) {
      return;
    }

    setSelectedRequest(null);
    setSelectedAction(null);
  };

  const handleSubmitReview = async (
    request: OfficerParoleRequest,
    payload: ReviewParoleRequestInput,
  ) => {
    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedRequest = await reviewParoleRequest(request.id, payload);

      onReviewed(updatedRequest);
      setSuccess('Parole request reviewed successfully.');
      setSelectedRequest(null);
      setSelectedAction(null);
    } catch (caughtError) {
      if (isApiServiceError(caughtError)) {
        if (caughtError.status === 401) {
          clearAccessToken();
          router.replace('/login');
          return;
        }

        if (caughtError.status === 403) {
          setError('Access denied');
          return;
        }

        setError(caughtError.message || 'Unable to review parole request');
        return;
      }

      setError('Unable to review parole request');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pd-20">
      <div className="card-box mb-30">
        <div className="pd-20">
          <h4 className="text-blue h4">Parole Requests</h4>
          <p className="mb-0">Review pending prisoner parole requests.</p>
        </div>

        <div className="pd-20 pt-0">
          {success ? (
            <div className="alert alert-success" role="status">
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          {requests.length === 0 ? (
            <div className="alert alert-info mb-0">
              No pending parole requests found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table table stripe hover nowrap">
                <thead>
                  <tr>
                    <th>Prisoner</th>
                    <th>Prisoner ID</th>
                    <th>Purpose</th>
                    <th>Dates</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.prisoner.name}</td>
                      <td>{request.prisoner.id}</td>
                      <td>{request.purpose}</td>
                      <td>
                        {formatDate(request.fromDate)} to{' '}
                        {formatDate(request.toDate)}
                      </td>
                      <td>{formatDateTime(request.createdAt)}</td>
                      <td>
                        <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => openReview(request, 'ACCEPTED')}
                            type="button"
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openReview(request, 'REJECTED')}
                            type="button"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ParoleReviewModal
        action={selectedAction}
        onClose={closeReview}
        onSubmit={handleSubmitReview}
        processing={processing}
        request={selectedRequest}
      />
    </div>
  );
}
