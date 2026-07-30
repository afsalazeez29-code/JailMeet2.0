'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera } from 'lucide-react';

import { ErrorAlert, SuccessAlert } from '@components/common/StatusAlert';
import { isApiServiceError } from '@/types/api';
import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { formatVisitorPublicId } from '@/lib/visitor-public-id';
import { updateVisitorProfile } from '@features/visitor-profile/services/visitor.service';
import type {
  UpdateVisitorProfileInput,
  VisitorProfileData,
} from '@features/visitor-profile/types';
import ProfilePictureModal from './ProfilePictureModal';
import styles from './VisitorSettingsForm.module.css';

const DEFAULT_AVATAR = '/images/avatars/visitor-default.png';

type FormState = {
  phone: string;
  address: string;
  state: string;
  zip: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const toFormState = (profile: VisitorProfileData['visitorProfile']): FormState => ({
  phone: profile.phone ?? '',
  address: profile.address ?? '',
  state: profile.state ?? '',
  zip: profile.zip ?? '',
});

const normalize = (form: FormState): FormState => ({
  phone: form.phone.trim(),
  address: form.address.trim(),
  state: form.state.trim(),
  zip: form.zip.trim(),
});

export default function VisitorSettingsForm({ profileData }: { profileData: VisitorProfileData }) {
  const router = useRouter();
  const [savedProfile, setSavedProfile] = useState(profileData);
  const [form, setForm] = useState(() => toFormState(profileData.visitorProfile));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pictureOpen, setPictureOpen] = useState(false);
  const user = savedProfile.user;
  const savedForm = useMemo(() => normalize(toFormState(savedProfile.visitorProfile)), [savedProfile]);
  const normalizedForm = normalize(form);
  const dirty = (Object.keys(form) as Array<keyof FormState>).some(
    (field) => normalizedForm[field] !== savedForm[field],
  );

  useEffect(() => {
    setSavedProfile(profileData);
    setForm(toFormState(profileData.visitorProfile));
  }, [profileData]);

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setRequestError(null);
    setSuccess(null);
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!/^[0-9]{10}$/.test(normalizedForm.phone)) next.phone = 'Phone must be exactly 10 digits';
    if (normalizedForm.address.length > 255) next.address = 'Address must be 255 characters or fewer';
    if (normalizedForm.state.length > 100) next.state = 'State or district must be 100 characters or fewer';
    if (normalizedForm.zip && !/^[0-9]{6}$/.test(normalizedForm.zip)) next.zip = 'ZIP code must be exactly 6 digits';
    return next;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !dirty) return;
    const fieldErrors = validate();
    setErrors(fieldErrors);
    setRequestError(null);
    setSuccess(null);
    if (Object.keys(fieldErrors).length) return;

    const payload: UpdateVisitorProfileInput = {};
    if (normalizedForm.phone !== savedForm.phone) payload.phone = normalizedForm.phone;
    if (normalizedForm.address !== savedForm.address) payload.address = normalizedForm.address;
    if (normalizedForm.state !== savedForm.state) payload.state = normalizedForm.state;
    if (normalizedForm.zip !== savedForm.zip) payload.zip = normalizedForm.zip;

    setSaving(true);
    try {
      const updated = await updateVisitorProfile(payload);
      setSavedProfile(updated);
      setForm(toFormState(updated.visitorProfile));
      setSuccess('Profile details updated successfully.');
    } catch (caughtError) {
      if (isApiServiceError(caughtError) && caughtError.status === 401) {
        clearAccessToken();
        navigateToLogin(router);
        return;
      }
      setRequestError(
        isApiServiceError(caughtError) && caughtError.status === 403
          ? 'Access denied'
          : 'Unable to update your profile. Review the fields and try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const updatePicture = (profileImageUrl: string | null) => {
    setSavedProfile((current) => ({
      ...current,
      user: { ...current.user, profileImageUrl },
    }));
    setSuccess(profileImageUrl ? 'Profile picture updated successfully.' : 'Profile picture removed successfully.');
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link className={styles.backLink} href="/visitor/profile"><ArrowLeft aria-hidden="true" /> Back to Profile</Link>
        <header className={styles.pageHeader}>
          <div><h1>Edit Profile</h1><p>Update the contact information permitted for your Visitor account.</p></div>
        </header>

        {success ? <SuccessAlert role="status">{success}</SuccessAlert> : null}
        {requestError ? <ErrorAlert role="alert">{requestError}</ErrorAlert> : null}

        <section className={styles.card}>
          <div className={styles.identityRow}>
            <button className={styles.avatarButton} onClick={() => setPictureOpen(true)} type="button" aria-label="Change profile picture">
              <img src={user.profileImageUrl || DEFAULT_AVATAR} alt={`${user.name || 'Visitor'} profile picture`} />
              <span><Camera aria-hidden="true" /></span>
            </button>
            <div><h2>{user.name || 'Not provided'}</h2><p>{user.email || 'Not provided'}</p><button className={styles.changePhotoButton} onClick={() => setPictureOpen(true)} type="button">Change profile picture</button></div>
          </div>

          <form noValidate onSubmit={submit}>
            <div className={styles.sectionHeading}><h2>Account information</h2><p>Identity details are read-only.</p></div>
            <div className={styles.formGrid}>
              <label><span>Visitor ID</span><input readOnly value={formatVisitorPublicId(savedProfile.visitorProfile.publicId)} /></label>
              <label><span>Full Name</span><input readOnly value={user.name || 'Not provided'} /></label>
              <label><span>Email</span><input readOnly value={user.email || 'Not provided'} /></label>
              <label><span>Role</span><input readOnly value={user.role} /></label>
            </div>

            <div className={styles.sectionHeading}><h2>Contact information</h2><p>Fields marked with an asterisk are required.</p></div>
            <div className={styles.formGrid}>
              <label><span>Phone Number *</span><input aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} disabled={saving} inputMode="numeric" maxLength={10} onChange={(event) => setField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))} value={form.phone} />{errors.phone ? <small id="phone-error" className={styles.fieldError}>{errors.phone}</small> : null}</label>
              <label><span>State / District</span><input aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? 'state-error' : undefined} disabled={saving} maxLength={100} onChange={(event) => setField('state', event.target.value)} value={form.state} />{errors.state ? <small id="state-error" className={styles.fieldError}>{errors.state}</small> : null}</label>
              <label className={styles.addressField}><span>Address</span><textarea aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'address-error' : undefined} disabled={saving} maxLength={255} onChange={(event) => setField('address', event.target.value)} rows={3} value={form.address} />{errors.address ? <small id="address-error" className={styles.fieldError}>{errors.address}</small> : null}</label>
              <label><span>ZIP / Postal Code</span><input aria-invalid={Boolean(errors.zip)} aria-describedby={errors.zip ? 'zip-error' : undefined} disabled={saving} inputMode="numeric" maxLength={6} onChange={(event) => setField('zip', event.target.value.replace(/\D/g, '').slice(0, 6))} value={form.zip} />{errors.zip ? <small id="zip-error" className={styles.fieldError}>{errors.zip}</small> : null}</label>
            </div>

            <div className={styles.actions}>
              <button className={styles.primaryButton} disabled={saving || !dirty} type="submit">{saving ? 'Saving...' : 'Save Changes'}</button>
              <button className={styles.secondaryButton} disabled={saving || !dirty} onClick={() => { setForm(toFormState(savedProfile.visitorProfile)); setErrors({}); setRequestError(null); setSuccess(null); }} type="button">Reset</button>
              <button className={styles.cancelButton} disabled={saving} onClick={() => router.push('/visitor/profile')} type="button">Cancel</button>
            </div>
          </form>
        </section>
      </div>

      <ProfilePictureModal currentImageUrl={user.profileImageUrl} visitorName={user.name} open={pictureOpen} onClose={() => setPictureOpen(false)} onUpdated={updatePicture} />
    </div>
  );
}
