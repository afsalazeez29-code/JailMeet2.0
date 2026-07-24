'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  ParoleStatus,
  PrisonerParoleRequest,
} from '@features/parole/types';
import ParoleStatusCard from './ParoleStatusCard';

type PrisonerParoleListProps = {
  requests: PrisonerParoleRequest[];
};

const filters: Array<{ label: string; value: ParoleStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function PrisonerParoleList({
  requests,
}: PrisonerParoleListProps) {
  const [filter, setFilter] = useState<ParoleStatus | 'ALL'>('ALL');
  const hasPendingRequest = requests.some(
    (request) => request.status === 'PENDING',
  );
  const filteredRequests = useMemo(
    () =>
      filter === 'ALL'
        ? requests
        : requests.filter((request) => request.status === filter),
    [filter, requests],
  );

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Parole Status</h5>
              <p className="mb-0 text-muted">
                Track your submitted parole requests and officer replies.
              </p>
            </div>
            <Link
              aria-disabled={hasPendingRequest}
              className={`btn ${
                hasPendingRequest ? 'btn-secondary disabled' : 'btn-primary'
              }`}
              href={hasPendingRequest ? '#' : '/prisoner/parole/request'}
            >
              Submit New Request
            </Link>
          </div>
          {hasPendingRequest ? (
            <div className="alert alert-warning mt-3 mb-0">
              You already have a pending parole request.
            </div>
          ) : null}
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="btn-group flex-wrap" role="group">
            {filters.map((item) => (
              <button
                className={`btn ${
                  filter === item.value ? 'btn-primary' : 'btn-outline-primary'
                }`}
                key={item.value}
                onClick={() => setFilter(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="alert alert-info mb-0">
              No parole requests found for this filter.
            </div>
          </div>
        </div>
      ) : (
        filteredRequests.map((request) => (
          <ParoleStatusCard key={request.id} request={request} />
        ))
      )}
    </>
  );
}
