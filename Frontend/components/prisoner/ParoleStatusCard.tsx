import { ParoleStatus, PrisonerParoleRequest } from '@/types/parole';

type ParoleStatusCardProps = {
  request: PrisonerParoleRequest;
};

const statusLabels: Record<ParoleStatus, string> = {
  PENDING: 'Pending Review',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected',
};

const statusClasses: Record<ParoleStatus, string> = {
  PENDING: 'badge-warning',
  ACCEPTED: 'badge-success',
  REJECTED: 'badge-danger',
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

export default function ParoleStatusCard({ request }: ParoleStatusCardProps) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-start">
          <div>
            <h5 className="mb-2">Parole Request</h5>
            <p className="mb-1">
              <strong>Relative:</strong> {request.relativeName}
            </p>
            <p className="mb-1">
              <strong>Relationship:</strong> {request.relationship}
            </p>
          </div>
          <span className={`badge ${statusClasses[request.status]}`}>
            {statusLabels[request.status]}
          </span>
        </div>

        <hr />

        <p className="mb-2">
          <strong>Reason / Purpose:</strong> {request.purpose}
        </p>
        {request.message ? (
          <p className="mb-2">
            <strong>Additional Message:</strong> {request.message}
          </p>
        ) : null}
        <p className="mb-2">
          <strong>Parole Dates:</strong> {formatDate(request.fromDate)} to{' '}
          {formatDate(request.toDate)}
        </p>
        <p className="mb-2">
          <strong>Officer Reply:</strong>{' '}
          {request.officerReply || 'No reply yet'}
        </p>
        <p className="mb-1">
          <strong>Submitted:</strong> {formatDateTime(request.createdAt)}
        </p>
        <p className="mb-0">
          <strong>Last Updated:</strong> {formatDateTime(request.updatedAt)}
        </p>
      </div>
    </div>
  );
}
