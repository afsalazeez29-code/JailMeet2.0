'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import defaultVisitorAvatar from '../../assets/default.PNG';
import { clearAccessToken } from '@/lib/auth';
import { updateVisitorProfile } from '@/services/visitor.service';
import { isApiServiceError } from '@/types/api';
import {
  UpdateVisitorProfileInput,
  VisitorProfileData,
} from '@/types/visitor';
import styles from './VisitorSettingsForm.module.css';

type VisitorSettingsFormProps = {
  profileData: VisitorProfileData;
};

type FormState = Required<UpdateVisitorProfileInput>;

const displayValue = (value?: string | null) => value || 'Not provided';

const toFormState = (
  profile: VisitorProfileData['visitorProfile'],
): FormState => ({
  phone: profile.phone ?? '',
  address: profile.address ?? '',
  state: profile.state ?? '',
  zip: profile.zip ?? '',
});

export default function VisitorSettingsForm({
  profileData,
}: VisitorSettingsFormProps) {
  const router = useRouter();
  const [savedProfileData, setSavedProfileData] = useState(profileData);
  const [formData, setFormData] = useState<FormState>(
    toFormState(profileData.visitorProfile),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const user = savedProfileData.user;

  useEffect(() => {
    setSavedProfileData(profileData);
    setFormData(toFormState(profileData.visitorProfile));
  }, [profileData]);

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return 'Phone must be exactly 10 digits';
    }

    if (formData.zip && !/^[0-9]{6}$/.test(formData.zip)) {
      return 'Zip must be exactly 6 digits';
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

    setSaving(true);

    try {
      const updatedProfile = await updateVisitorProfile({
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        state: formData.state.trim(),
        zip: formData.zip.trim(),
      });

      setSavedProfileData(updatedProfile);
      setFormData(toFormState(updatedProfile.visitorProfile));
      setSuccess('Changes Saved Successfully!');
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

        setError(caughtError.message || 'Unable to update visitor profile');
        return;
      }

      setError('Unable to update visitor profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">Account Settings</span>
      </h4>

      <div className="row">
        <div className="col-md-12">
          <ul className="nav nav-pills flex-column flex-md-row mb-3">
            <li className="nav-item">
              <span className="nav-link active">
                <i className="bx bx-user me-1"></i>
                My Profile
              </span>
            </li>
          </ul>

          <div className="card mb-4">
            <h5 className="card-header">Profile Details</h5>
            <hr className="my-0" />
            <div className="card-body">
              <div className="d-flex align-items-start align-items-sm-center gap-4 mb-4">
                <img
                  src={defaultVisitorAvatar.src}
                  alt="Visitor avatar"
                  className={`d-block rounded ${styles.avatarPreview}`}
                />
                <div>
                  <h5 className="mb-1">{displayValue(user.name)}</h5>
                  <p className="text-muted mb-0">
                    Profile image upload is not available yet.
                  </p>
                </div>
              </div>

              {success ? (
                <div className="alert alert-success text-center" role="status">
                  {success}
                </div>
              ) : null}

              {error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : null}

              <form id="formAccountSettings" onSubmit={handleSubmit}>
                <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">Full Name</label>
                  <div className={styles.readonlyValue}>
                    {displayValue(user.name)}
                  </div>
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">E-mail</label>
                  <div className={styles.readonlyValue}>
                    {displayValue(user.email)}
                  </div>
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Visitor/User ID</label>
                  <div className={styles.readonlyValue}>
                    {displayValue(user.id)}
                  </div>
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Role</label>
                  <div className={styles.readonlyValue}>
                    {displayValue(user.role)}
                  </div>
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text">IN(+91)</span>
                    <input
                      className="form-control"
                      id="phoneNumber"
                      maxLength={10}
                      name="phoneNumber"
                      onChange={(event) =>
                        updateField(
                          'phone',
                          event.target.value.replace(/\D/g, '').slice(0, 10),
                        )
                      }
                      pattern="[0-9]{10}"
                      required
                      type="text"
                      value={formData.phone}
                    />
                  </div>
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">State</label>
                  <input
                    className="form-control"
                    id="state"
                    maxLength={100}
                    name="state"
                    onChange={(event) => updateField('state', event.target.value)}
                    type="text"
                    value={formData.state}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    id="address"
                    maxLength={255}
                    name="address"
                    onChange={(event) =>
                      updateField('address', event.target.value)
                    }
                    type="text"
                    value={formData.address}
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Zip Code</label>
                  <input
                    className="form-control"
                    id="zipCode"
                    maxLength={6}
                    name="zipCode"
                    onChange={(event) =>
                      updateField(
                        'zip',
                        event.target.value.replace(/\D/g, '').slice(0, 6),
                      )
                    }
                    pattern="[0-9]{6}"
                    type="text"
                    value={formData.zip}
                  />
                </div>

                <div className="mt-3">
                  <button
                    className="btn btn-primary"
                    disabled={saving}
                    type="submit"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
              </form>
            </div>
          </div>

          <div className="card">
            <h5 className="card-header">Security</h5>
            <div className="card-body">
              <div className={`alert alert-warning ${styles.notice}`}>
                Password changes are handled separately from profile updates.
              </div>
              <Link href="/visitor/change-password" className="btn btn-primary mt-3">
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
