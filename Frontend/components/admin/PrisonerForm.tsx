'use client';

import { FormEvent, useEffect, useState } from 'react';

import { CreatePrisonerInput, UpdatePrisonerInput } from '@/types/admin';

type PrisonerFormProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<CreatePrisonerInput>;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (data: CreatePrisonerInput | UpdatePrisonerInput) => Promise<void>;
};

const dateOnly = (value?: string) => (value ? value.slice(0, 10) : '');

export default function PrisonerForm({
  error,
  initialValues,
  isSubmitting,
  mode,
  onSubmit,
}: PrisonerFormProps) {
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(initialValues?.name ?? '');
  const [age, setAge] = useState(String(initialValues?.age ?? ''));
  const [gender, setGender] = useState(initialValues?.gender ?? '');
  const [admissionDate, setAdmissionDate] = useState(dateOnly(initialValues?.admissionDate));
  const [caseDetails, setCaseDetails] = useState(initialValues?.caseDetails ?? '');
  const [sentencePeriod, setSentencePeriod] = useState(initialValues?.sentencePeriod ?? '');
  const [jailType, setJailType] = useState(initialValues?.jailType ?? '');
  const [jailName, setJailName] = useState(initialValues?.jailName ?? '');
  const [cellNumber, setCellNumber] = useState(initialValues?.cellNumber ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(initialValues?.email ?? '');
    setName(initialValues?.name ?? '');
    setAge(String(initialValues?.age ?? ''));
    setGender(initialValues?.gender ?? '');
    setAdmissionDate(dateOnly(initialValues?.admissionDate));
    setCaseDetails(initialValues?.caseDetails ?? '');
    setSentencePeriod(initialValues?.sentencePeriod ?? '');
    setJailType(initialValues?.jailType ?? '');
    setJailName(initialValues?.jailName ?? '');
    setCellNumber(initialValues?.cellNumber ?? '');
  }, [initialValues]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);
    if (mode === 'create' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setValidationError('Valid email is required');
    if (mode === 'create' && password.length < 8) return setValidationError('Password must be at least 8 characters');
    if (!name.trim()) return setValidationError('Name is required');
    if (!Number(age) || Number(age) < 1) return setValidationError('Valid age is required');
    if (!gender.trim()) return setValidationError('Gender is required');
    if (!admissionDate) return setValidationError('Admission date is required');
    const common = {
      name: name.trim(),
      age: Number(age),
      gender: gender.trim(),
      admissionDate: new Date(`${admissionDate}T00:00:00`).toISOString(),
      caseDetails: caseDetails.trim() || null,
      sentencePeriod: sentencePeriod.trim() || null,
      jailType: jailType.trim() || null,
      jailName: jailName.trim() || null,
      cellNumber: cellNumber.trim() || null,
    };
    await onSubmit(mode === 'create' ? { email: email.trim(), password, ...common } : common);
  };

  return (
    <form className="card" onSubmit={submit}>
      <div className="card-body">
        {validationError || error ? <div className="alert alert-danger">{validationError || error}</div> : null}
        {mode === 'create' ? (
          <div className="row">
            <div className="form-group col-md-6"><label>Email</label><input className="form-control" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></div>
            <div className="form-group col-md-6"><label>Password</label><input className="form-control" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></div>
          </div>
        ) : null}
        <div className="row">
          <div className="form-group col-md-6"><label>Name</label><input className="form-control" onChange={(event) => setName(event.target.value)} required value={name} /></div>
          <div className="form-group col-md-3"><label>Age</label><input className="form-control" min={1} onChange={(event) => setAge(event.target.value)} required type="number" value={age} /></div>
          <div className="form-group col-md-3"><label>Gender</label><input className="form-control" onChange={(event) => setGender(event.target.value)} required value={gender} /></div>
        </div>
        <div className="row">
          <div className="form-group col-md-4"><label>Admission Date</label><input className="form-control" onChange={(event) => setAdmissionDate(event.target.value)} required type="date" value={admissionDate} /></div>
          <div className="form-group col-md-4"><label>Jail Type</label><input className="form-control" onChange={(event) => setJailType(event.target.value)} value={jailType ?? ''} /></div>
          <div className="form-group col-md-4"><label>Jail Name</label><input className="form-control" onChange={(event) => setJailName(event.target.value)} value={jailName ?? ''} /></div>
        </div>
        <div className="row">
          <div className="form-group col-md-4"><label>Cell Number</label><input className="form-control" onChange={(event) => setCellNumber(event.target.value)} value={cellNumber ?? ''} /></div>
          <div className="form-group col-md-4"><label>Sentence Period</label><input className="form-control" onChange={(event) => setSentencePeriod(event.target.value)} value={sentencePeriod ?? ''} /></div>
        </div>
        <div className="form-group"><label>Case Details</label><textarea className="form-control" onChange={(event) => setCaseDetails(event.target.value)} rows={4} value={caseDetails ?? ''}></textarea></div>
        <button className="btn btn-primary" disabled={isSubmitting} type="submit">{isSubmitting ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Prisoner' : 'Save Changes')}</button>
      </div>
    </form>
  );
}
