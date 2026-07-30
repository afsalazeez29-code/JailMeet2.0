'use client';

import {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Camera, MoreVertical, RotateCw, Upload, X } from 'lucide-react';

import { useProfilePicture } from '@features/visitor-profile/hooks/useProfilePicture';
import { createCroppedProfileImage } from '@features/visitor-profile/utils/crop-image';
import type {
  ProfilePictureModalProps,
  ProfilePictureStep,
} from '@features/visitor-profile/types/profile-picture.types';
import styles from './ProfilePictureModal.module.css';

const DEFAULT_AVATAR = '/images/avatars/visitor-default.png';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function ProfilePictureModal({
  currentImageUrl,
  visitorName,
  open,
  onClose,
  onUpdated,
}: ProfilePictureModalProps) {
  const [step, setStep] = useState<ProfilePictureStep>('menu');
  const [source, setSource] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const deviceInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<FileReader | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const { error, processing, remove, setError, upload } =
    useProfilePicture(onUpdated);

  const resetEditor = useCallback(() => {
    if (readerRef.current?.readyState === FileReader.LOADING) {
      readerRef.current.abort();
    }
    readerRef.current = null;
    setSource(null);
    setCrop({ x: 0, y: 0 });
    setCropPixels(null);
    setZoom(1);
    setRotation(0);
    setMenuOpen(false);
    setError(null);
    setStep('menu');
  }, [setError]);

  const close = useCallback(() => {
    if (processing) return;
    resetEditor();
    onClose();
  }, [onClose, processing, resetEditor]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>('button:not(:disabled)')
        ?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (readerRef.current?.readyState === FileReader.LOADING) {
        readerRef.current.abort();
      }
      restoreFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) resetEditor();
  }, [open, resetEditor]);

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !processing) {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;
    event.currentTarget.value = '';
    setError(null);

    if (!file) {
      setError('Select one image');
      return;
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Select a JPEG, PNG, or WebP image');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Profile picture must be 5 MB or smaller');
      return;
    }

    setStep('preparing');
    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setError('Unable to prepare the selected image');
        setStep('menu');
        return;
      }
      setSource(reader.result);
      setStep('crop');
      readerRef.current = null;
    };
    reader.onerror = () => {
      setError('Unable to prepare the selected image');
      setStep('menu');
      readerRef.current = null;
    };
    reader.onabort = () => {
      setStep('menu');
      readerRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  const savePhoto = async () => {
    if (!source || !cropPixels || processing) return;
    setError(null);
    try {
      const file = await createCroppedProfileImage(
        source,
        cropPixels,
        rotation,
      );
      const succeeded = await upload(file);
      if (succeeded) {
        resetEditor();
        onClose();
      }
    } catch {
      setError('Unable to prepare the selected image');
    }
  };

  const confirmRemove = async () => {
    const succeeded = await remove();
    if (succeeded) {
      resetEditor();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        aria-busy={processing}
        aria-describedby={error ? 'profile-picture-error' : undefined}
        aria-labelledby="profile-picture-title"
        aria-modal="true"
        className={styles.dialog}
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
        role="dialog"
      >
        <header className={styles.header}>
          <h2 id="profile-picture-title">
            {step === 'crop' ? 'Crop & rotate' : 'Change profile picture'}
          </h2>
          <div className={styles.headerActions}>
            {step === 'menu' && currentImageUrl ? (
              <div className={styles.overflowWrap}>
                <button
                  aria-expanded={menuOpen}
                  aria-label="Profile picture options"
                  className={styles.iconButton}
                  onClick={() => setMenuOpen((current) => !current)}
                  type="button"
                >
                  <MoreVertical aria-hidden="true" />
                </button>
                {menuOpen ? (
                  <div className={styles.overflowMenu}>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setStep('remove');
                      }}
                      type="button"
                    >
                      Remove profile picture
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
            <button
              aria-label="Close profile picture dialog"
              className={styles.iconButton}
              disabled={processing}
              onClick={close}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={styles.body}>
          {error ? (
            <p className={styles.error} id="profile-picture-error" role="alert">
              {error}
            </p>
          ) : null}

          {step === 'menu' ? (
            <>
              <img
                alt={`${visitorName || 'Visitor'} profile picture`}
                className={styles.largeAvatar}
                src={currentImageUrl || DEFAULT_AVATAR}
              />
              <div className={styles.optionGrid}>
                <button
                  className={styles.optionButton}
                  onClick={() => deviceInputRef.current?.click()}
                  type="button"
                >
                  <Upload aria-hidden="true" />
                  Upload from Device
                </button>
                <button
                  className={styles.optionButton}
                  onClick={() => cameraInputRef.current?.click()}
                  type="button"
                >
                  <Camera aria-hidden="true" />
                  Take a Picture
                </button>
              </div>
              <input
                accept="image/jpeg,image/png,image/webp"
                aria-describedby={error ? 'profile-picture-error' : undefined}
                className={styles.hiddenInput}
                onChange={selectFile}
                ref={deviceInputRef}
                type="file"
              />
              <input
                accept="image/jpeg,image/png,image/webp"
                capture="user"
                className={styles.hiddenInput}
                onChange={selectFile}
                ref={cameraInputRef}
                type="file"
              />
              <p className={styles.help}>JPEG, PNG, or WebP. Maximum 5 MB.</p>
            </>
          ) : null}

          {step === 'preparing' ? (
            <div className={styles.centerState}>
              <span className={styles.spinner} aria-hidden="true" />
              <p>Preparing photo...</p>
              <button className={styles.secondaryButton} onClick={resetEditor} type="button">
                Cancel
              </button>
            </div>
          ) : null}

          {step === 'crop' && source ? (
            <>
              <div className={styles.cropArea}>
                <Cropper
                  aspect={1}
                  crop={crop}
                  cropShape="round"
                  image={source}
                  onCropChange={setCrop}
                  onCropComplete={(_area, pixels) => setCropPixels(pixels)}
                  onZoomChange={setZoom}
                  rotation={rotation}
                  showGrid={false}
                  zoom={zoom}
                />
              </div>
              <div className={styles.controls}>
                <label htmlFor="profile-zoom">Zoom</label>
                <input
                  id="profile-zoom"
                  max="3"
                  min="1"
                  onChange={(event) => setZoom(Number(event.target.value))}
                  step="0.1"
                  type="range"
                  value={zoom}
                />
                <button
                  className={styles.secondaryButton}
                  onClick={() => setRotation((current) => (current + 90) % 360)}
                  type="button"
                >
                  <RotateCw aria-hidden="true" /> Rotate 90°
                </button>
              </div>
              <div className={styles.footerActions}>
                <button className={styles.secondaryButton} disabled={processing} onClick={resetEditor} type="button">
                  Back
                </button>
                <button className={styles.primaryButton} disabled={processing || !cropPixels} onClick={savePhoto} type="button">
                  {processing ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </>
          ) : null}

          {step === 'remove' ? (
            <div className={styles.removeState}>
              <img
                alt={`${visitorName || 'Visitor'} current profile picture`}
                className={styles.removeAvatar}
                src={currentImageUrl || DEFAULT_AVATAR}
              />
              <h3>Remove your profile picture?</h3>
              <p>The default Visitor avatar will be shown instead.</p>
              <div className={styles.footerActions}>
                <button className={styles.secondaryButton} disabled={processing} onClick={() => setStep('menu')} type="button">
                  Cancel
                </button>
                <button className={styles.dangerButton} disabled={processing} onClick={confirmRemove} type="button">
                  {processing ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
