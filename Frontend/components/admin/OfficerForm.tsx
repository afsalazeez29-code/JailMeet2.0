'use client';

import { FormEvent, useEffect, useState } from 'react';

import { CreateOfficerInput, UpdateOfficerInput } from '@/types/admin';

type OfficerFormProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<CreateOfficerInput>;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (data: CreateOfficerInput | UpdateOfficerInput) => Promise<void>;
};

export default function OfficerForm({
  error,
  initialValues,
  isSubmitting,
  mode,
  onSubmit,
}: OfficerFormProps) {
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(initialValues?.name ?? '');
  const [phone, setPhone] = useState(initialValues?.phone ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(initialValues?.email ?? '');
    setName(initialValues?.name ?? '');
    setPhone(initialValues?.phone ?? '');
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (mode === 'create' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Valid email is required');
      return;
    }

    if (mode === 'create' && password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    if (!name.trim()) {
      setValidationError('Name is required');
      return;
    }

    await onSubmit(
      mode === 'create'
        ? { email: email.trim(), password, name: name.trim(), phone: phone.trim() || undefined }
        : { name: name.trim(), phone: phone.trim() || null },
    );
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-body">
        {validationError || error ? (
          <div className="alert alert-danger">{validationError || error}</div>
        ) : null}
        {mode === 'create' ? (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input className="form-control" id="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input className="form-control" id="password" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            </div>
          </>
        ) : null}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input className="form-control" id="name" onChange={(event) => setName(event.target.value)} required type="text" value={name} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input className="form-control" id="phone" onChange={(event) => setPhone(event.target.value)} type="text" value={phone ?? ''} />
        </div>
        <button className="btn btn-primary" disabled={isSubmitting} type="submit">
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
              ? 'Create Officer'
              : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
