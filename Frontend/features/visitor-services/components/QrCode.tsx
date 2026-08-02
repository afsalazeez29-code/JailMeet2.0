'use client';

import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

export default function QrCode({ value, label }: { value: string; label: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(value, { errorCorrectionLevel: 'M', margin: 1, width: 220 })
      .then((data) => { if (active) setSrc(data); });
    return () => { active = false; };
  }, [value]);
  return src ? <img alt={label} src={src} /> : <span aria-live="polite">Generating QR code…</span>;
}
