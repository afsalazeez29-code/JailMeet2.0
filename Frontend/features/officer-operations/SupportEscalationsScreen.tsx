'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorAlert, LoadingAlert, SuccessAlert } from '@components/common/StatusAlert';
import { isApiServiceError } from '@/types/api';
import { officerGet, officerMutation } from './service';

type Item = {
  reference: string; category: string; subject: string; message: string; status: string;
  escalatedAt: string | null; officerResponse: string | null;
  officerHandledAt: string | null;
  prisoner: { publicId: string; name: string };
};

export default function SupportEscalationsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const load = useCallback(async () => {
    try { setItems(await officerGet<Item[]>('/officer/support-escalations')); }
    catch (e) { setError(isApiServiceError(e) ? e.message : 'Unable to load support actions'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const respond = async (item: Item) => {
    try {
      await officerMutation(`/officer/support-escalations/${item.reference}`, 'PATCH', { response: responses[item.reference], handled: true });
      setSuccess('Operational response saved. Admin retains final status control.');
      await load();
    } catch (errorValue) {
      setError(isApiServiceError(errorValue) ? errorValue.message : 'Unable to save response');
    }
  };
  if (loading) return <div className="pd-20"><LoadingAlert>Loading support actions...</LoadingAlert></div>;
  return (
    <div className="pd-20">
      <h1 className="h4">Escalated Support Actions</h1>
      {error ? <ErrorAlert>{error}</ErrorAlert> : null}
      {success ? <SuccessAlert>{success}</SuccessAlert> : null}
      {items.length === 0 ? <p>No support actions are assigned to you.</p> : items.map((item) => (
        <article className="card mb-3" key={item.reference}>
          <div className="card-body">
            <h2 className="h5">{item.subject}</h2>
            <p className="text-muted">{item.prisoner.name} ({item.prisoner.publicId || 'ID unavailable'}) â€” {item.category}</p>
            <p>{item.message}</p>
            {item.officerHandledAt ? <p><strong>Handled:</strong> {item.officerResponse}</p> : (
              <>
                <label className="form-label" htmlFor={`response-${item.reference}`}>Operational response for {item.reference}</label>
                <textarea id={`response-${item.reference}`} className="form-control mb-2" value={responses[item.reference] || ''} onChange={(event) => setResponses((value) => ({ ...value, [item.reference]: event.target.value }))} minLength={5} maxLength={2000} />
                <button className="btn btn-primary" disabled={(responses[item.reference] || '').trim().length < 5} onClick={() => void respond(item)} type="button">Respond and mark handled</button>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
