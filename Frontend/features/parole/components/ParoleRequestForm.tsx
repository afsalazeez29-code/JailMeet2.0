'use client';

import { ErrorAlert, SuccessAlert } from '../../../components/common/StatusAlert';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { createParoleRequest } from '@features/parole/services/parole.service';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';
import { isApiServiceError } from '@/types/api';

const getDateInputValue = (date: Date): string =>
  date.toISOString().slice(0, 10);

export default function ParoleRequestForm() {
  const router = useRouter();
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return getDateInputValue(date);
  }, []);
  const [relativeName, setRelativeName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [fromDate, setFromDate] = useState(tomorrow);
  const [toDate, setToDate] = useState(tomorrow);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (!relativeName.trim()) {
      return 'Relative name is required';
    }

    if (!relationship.trim()) {
      return 'Relationship is required';
    }

    if (!purpose.trim()) {
      return 'Reason is required';
    }

    if (purpose.trim().length < 10) {
      return 'Reason is too short';
    }

    const from = new Date(`${fromDate}T09:00:00`);
    const to = new Date(`${toDate}T18:00:00`);

    if (Number.isNaN(from.getTime()) || from <= new Date()) {
      return 'From date must be in the future';
    }

    if (Number.isNaN(to.getTime()) || to < from) {
      return 'To date must be after from date';
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await createParoleRequest({
        relativeName: relativeName.trim(),
        relationship: relationship.trim(),
        purpose: purpose.trim(),
        message: message.trim() || undefined,
        fromDate: new Date(`${fromDate}T09:00:00`).toISOString(),
        toDate: new Date(`${toDate}T18:00:00`).toISOString(),
      });

      setSuccess('Parole request submitted successfully.');
      window.setTimeout(() => {
        router.push('/prisoner/parole');
      }, 800);
    } catch (caughtError) {
      if (isApiServiceError(caughtError)) {
        if (caughtError.status === 401) {
          clearAccessToken();
          navigateToLogin(router);
          return;
        }

        if (caughtError.status === 403) {
          setError('Access denied');
          return;
        }

        if (caughtError.status === 409) {
          setError('A pending parole request already exists');
          return;
        }

        setError(caughtError.message || 'Unable to submit parole request');
        return;
      }

      setError('Unable to submit parole request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Submit Parole Request</h5>
      </div>
      <div className="card-body">
        {success ? (
          <SuccessAlert role="status">{success}</SuccessAlert>
        ) : null}

        {error ? (
          <ErrorAlert role="alert">{error}</ErrorAlert>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="relativeName">Relative Name</label>
            <input
              className="form-control"
              disabled={submitting}
              id="relativeName"
              maxLength={100}
              onChange={(event) => setRelativeName(event.target.value)}
              required
              type="text"
              value={relativeName}
            />
          </div>

          <div className="form-group">
            <label htmlFor="relationship">Relationship</label>
            <input
              className="form-control"
              disabled={submitting}
              id="relationship"
              maxLength={100}
              onChange={(event) => setRelationship(event.target.value)}
              required
              type="text"
              value={relationship}
            />
          </div>

          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="fromDate">From Date</label>
              <input
                className="form-control"
                disabled={submitting}
                id="fromDate"
                min={tomorrow}
                onChange={(event) => setFromDate(event.target.value)}
                required
                type="date"
                value={fromDate}
              />
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="toDate">To Date</label>
              <input
                className="form-control"
                disabled={submitting}
                id="toDate"
                min={fromDate}
                onChange={(event) => setToDate(event.target.value)}
                required
                type="date"
                value={toDate}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Reason / Purpose</label>
            <textarea
              className="form-control"
              disabled={submitting}
              id="purpose"
              maxLength={1000}
              onChange={(event) => setPurpose(event.target.value)}
              required
              rows={5}
              value={purpose}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="message">Additional Message</label>
            <textarea
              className="form-control"
              disabled={submitting}
              id="message"
              maxLength={1000}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              value={message}
            ></textarea>
          </div>

          <button
            className="btn btn-primary"
            disabled={submitting}
            type="submit"
          >
            <AnimatedButtonText>{submitting ? 'Submitting...' : 'Submit Request'}</AnimatedButtonText>
          </button>
        </form>
      </div>
    </div>
  );
}



