'use client';

import { useEffect, useState } from 'react';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { officerGet } from '@features/officer-operations/service';
import { ErrorAlert, LoadingAlert } from '@components/common/StatusAlert';
import { isApiServiceError } from '@/types/api';
import styles from './OfficerProfile.module.css';

type Profile = {
  publicId: string; name: string; profilePic: string | null; email: string;
  role: string; isActive: boolean; designation: string | null;
  department: string | null; joiningDate: string | null; shift: string | null;
  officeLocation: string | null; medicalAccessLevel: string;
  assignedPrisonerCount: number; recentActionCount: number;
};

export default function OfficerProfilePage() {
  const auth = useProtectedPage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (auth.isReady) officerGet<Profile>('/officer/profile').then(setProfile).catch((e) => setError(isApiServiceError(e) ? e.message : 'Unable to load profile'));
  }, [auth.isReady]);
  if (auth.isLoading || (!profile && !error)) return <div className="pd-20"><LoadingAlert>Loading profile...</LoadingAlert></div>;
  if (error) return <div className="pd-20"><ErrorAlert>{error}</ErrorAlert></div>;
  if (!profile) return null;
  const fields = {
    Email: profile.email, Role: profile.role, Designation: profile.designation,
    Department: profile.department, 'Joining date': profile.joiningDate,
    Shift: profile.shift, 'Office location': profile.officeLocation,
    'Account status': profile.isActive ? 'Active' : 'Inactive',
    'Medical access': profile.medicalAccessLevel,
    'Assigned prisoners': profile.assignedPrisonerCount,
    'Actions in last 7 days': profile.recentActionCount,
  };
  return <div className="container-xxl flex-grow-1 container-p-y"><h1 className="h4 fw-bold py-3">Account / My Profile</h1><div className="card"><div className="card-body"><div className="d-flex flex-wrap align-items-center gap-3 mb-4"><img src={profile.profilePic?.trim() || '/images/avatars/officer-default.PNG'} alt={`${profile.name} profile`} className={styles.profileImage} onError={(event) => { if (event.currentTarget.dataset.fallbackApplied === 'true') return; event.currentTarget.dataset.fallbackApplied = 'true'; event.currentTarget.src = '/images/avatars/officer-default.PNG'; }} /><div><h2 className="h4 mb-1">{profile.name}</h2><p className="text-muted mb-0">{profile.publicId}</p></div></div><div className="row">{Object.entries(fields).map(([label, value]) => <div className="col-md-6 mb-3" key={label}><strong>{label}</strong><div>{value ?? '—'}</div></div>)}</div></div></div></div>;
}
