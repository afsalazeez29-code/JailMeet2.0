'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, KeyRound, Pencil, UserRoundPen } from 'lucide-react';

import { SuccessAlert } from '@components/common/StatusAlert';
import { formatVisitorPublicId } from '@/lib/visitor-public-id';
import ProfilePictureModal from './ProfilePictureModal';
import type { VisitorProfileData } from '@features/visitor-profile/types';
import styles from './VisitorProfileView.module.css';

const DEFAULT_AVATAR = '/images/avatars/visitor-default.png';
const display = (value?: string | null) => value?.trim() || 'Not provided';

export default function VisitorProfileView({ profileData }: { profileData: VisitorProfileData }) {
  const [profile, setProfile] = useState(profileData);
  const [pictureOpen, setPictureOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, visitorProfile } = profile;

  const updatePicture = (profileImageUrl: string | null) => {
    setProfile((current) => ({
      ...current,
      user: { ...current.user, profileImageUrl },
    }));
    setSuccess(
      profileImageUrl
        ? 'Profile picture updated successfully.'
        : 'Profile picture removed successfully.',
    );
  };

  const details = [
    ['Visitor ID', formatVisitorPublicId(visitorProfile.publicId)],
    ['Full Name', display(user.name)],
    ['Email', display(user.email)],
    ['Phone Number', display(visitorProfile.phone)],
    ['State / District', display(visitorProfile.state)],
    ['ZIP / Postal Code', display(visitorProfile.zip)],
    ['Address', display(visitorProfile.address)],
    ['Role', display(user.role)],
  ];

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {success ? <SuccessAlert role="status">{success}</SuccessAlert> : null}
        <section className={styles.hero}>
          <button className={styles.avatarButton} onClick={() => setPictureOpen(true)} type="button" aria-label="Change profile picture">
            <img src={user.profileImageUrl || DEFAULT_AVATAR} alt={`${display(user.name)} profile picture`} />
            <span><Pencil aria-hidden="true" /></span>
          </button>
          <div className={styles.identity}>
            <div className={styles.badges}>
              <span className={styles.roleBadge}>VISITOR</span>
              {user.isActive !== undefined ? (
                <span className={user.isActive ? styles.activeBadge : styles.inactiveBadge}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              ) : null}
            </div>
            <h1>{display(user.name)}</h1>
            <p>{display(user.email)}</p>
            {visitorProfile.publicId ? <small>{formatVisitorPublicId(visitorProfile.publicId)}</small> : null}
          </div>
          <Link className={styles.primaryAction} href="/visitor/settings"><UserRoundPen aria-hidden="true" /> Edit Profile</Link>
        </section>

        <section className={styles.card} aria-labelledby="personal-information-title">
          <div className={styles.cardHeading}>
            <div><span>Visitor account</span><h2 id="personal-information-title">Personal Information</h2></div>
          </div>
          <dl className={styles.infoGrid}>
            {details.map(([label, value]) => (
              <div className={label === 'Address' ? styles.wideItem : undefined} key={label}>
                <dt>{label}</dt><dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className={styles.actions} aria-label="Profile actions">
          <Link className={styles.primaryAction} href="/visitor/settings"><UserRoundPen aria-hidden="true" /> Edit Profile</Link>
          <Link className={styles.outlineAction} href="/visitor/change-password"><KeyRound aria-hidden="true" /> Change Password</Link>
          <Link className={styles.neutralAction} href="/visitor/dashboard"><ArrowLeft aria-hidden="true" /> Back to Visitor Dashboard</Link>
        </nav>
      </div>
      <ProfilePictureModal currentImageUrl={user.profileImageUrl} visitorName={user.name} open={pictureOpen} onClose={() => setPictureOpen(false)} onUpdated={updatePicture} />
    </div>
  );
}
