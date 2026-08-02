'use client';

import { useEffect, useState } from 'react';

import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { getVisitPasses } from '../services/visitor-services.service';
import type { VisitPass } from '../types';
import QrCode from '../components/QrCode';
import styles from '../components/VisitorServices.module.css';

const fallback = '/images/avatars/prisoner-default.PNG';
const format = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function VisitPassesScreen() {
  const auth = useProtectedPage();
  const [passes, setPasses] = useState<VisitPass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printingCode, setPrintingCode] = useState<string | null>(null);

  useEffect(() => {
    if (!printingCode) return;
    const clearPrintSelection = () => setPrintingCode(null);
    window.addEventListener('afterprint', clearPrintSelection, { once: true });
    const frame = window.requestAnimationFrame(() => window.print());
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('afterprint', clearPrintSelection);
    };
  }, [printingCode]);

  useEffect(() => {
    if (!auth.isReady) return;
    let mounted = true;
    setLoading(true);
    void getVisitPasses().then((data) => { if (mounted) setPasses(data); }).catch((caught) => {
      if (!mounted) return;
      if (isApiServiceError(caught) && caught.status === 401) auth.redirectToLogin();
      else setError(isApiServiceError(caught) ? caught.message : 'Unable to load visit passes');
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [auth.isReady, auth.redirectToLogin]);

  if (auth.isLoading || loading) return <div className={styles.page}><LoadingAlert>Loading upcoming visits…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  if (auth.error || error) return <div className={styles.page}><ErrorAlert>{auth.error || error}</ErrorAlert></div>;

  return <div className={styles.page}>
    <h1 className={styles.heading}>Upcoming Visits</h1>
    <p className={styles.subheading}>Approved appointments and secure visit passes.</p>
    {!passes.length ? <EmptyStateAlert className={styles.empty}>No approved upcoming visits.</EmptyStateAlert> : null}
    <div className={styles.grid}>
      {passes.map((pass) => <article className={`${styles.card}${printingCode && printingCode !== pass.passCode ? ` ${styles.printHidden}` : ''}`} key={pass.passCode}>
        <div className={styles.cardHeader}>
          <div className={styles.identity}>
            <img alt={`${pass.prisoner.name} profile`} className={styles.avatar} src={pass.prisoner.profilePic || fallback} />
            <div><h2>{pass.prisoner.name}</h2><p className={styles.muted}>{pass.prisoner.publicId} · {pass.appointmentReference}</p></div>
          </div>
          <span className={`${styles.status} ${styles[pass.passStatus.toLowerCase()]}`}>{pass.passStatus}</span>
        </div>
        <div className={styles.passBody}>
          <dl className={styles.details}>
            <div><dt>Status</dt><dd>Approved</dd></div>
            <div><dt>Appointment</dt><dd>{format(pass.appointmentAt)}</dd></div>
            <div><dt>Purpose</dt><dd>{pass.purpose}</dd></div>
            <div><dt>Jail</dt><dd>{pass.prisoner.jailName || 'Provided with Officer instructions'}</dd></div>
            <div><dt>Pass expires</dt><dd>{format(pass.expiresAt)}</dd></div>
            <div><dt>Instructions</dt><dd>{pass.reportingInstructions}</dd></div>
          </dl>
          <div className={styles.qr}>
            <QrCode label={`QR code for visit pass ${pass.appointmentReference}`} value={pass.passCode} />
            <span className={styles.passCode}>{pass.passCode}</span>
          </div>
        </div>
        <div className={`${styles.actions} ${styles.noPrint}`}><button aria-label={`Print pass for ${pass.prisoner.name}`} className="btn btn-primary" onClick={() => setPrintingCode(pass.passCode)} type="button">Print Pass</button></div>
      </article>)}
    </div>
  </div>;
}
