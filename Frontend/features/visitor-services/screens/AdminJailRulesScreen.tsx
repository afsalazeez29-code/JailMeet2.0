'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { createJailRule, getAdminJailRules, updateJailRule } from '../services/visitor-services.service';
import type { JailRule } from '../types';
import styles from '../components/VisitorServices.module.css';

type RuleForm = Pick<JailRule, 'title' | 'category' | 'content' | 'sortOrder' | 'isActive' | 'audience'>;
const emptyForm: RuleForm = { title: '', category: '', content: '', sortOrder: 0, isActive: true, audience: 'VISITOR' };

export default function AdminJailRulesScreen() {
  const auth = useProtectedPage();
  const [rules, setRules] = useState<JailRule[]>([]);
  const [form, setForm] = useState<RuleForm>(emptyForm);
  const [audienceFilter, setAudienceFilter] = useState<'ANY' | JailRule['audience']>('ANY');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setRules(await getAdminJailRules(audienceFilter === 'ANY' ? undefined : audienceFilter)); }
    catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to load jail rules'); }
    finally { setLoading(false); }
  }, [audienceFilter]);

  useEffect(() => { if (auth.isReady) void load(); }, [auth.isReady, load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true); setError(null); setSuccess(null);
    try {
      if (editingId) await updateJailRule(editingId, form);
      else await createJailRule(form);
      setSuccess(editingId ? 'Jail rule updated.' : 'Jail rule created.');
      setForm(emptyForm); setEditingId(null); await load();
    } catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to save jail rule'); }
    finally { setSaving(false); }
  };

  if (auth.isLoading || (loading && !rules.length)) return <div className={styles.page}><LoadingAlert>Loading jail rules…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Jail Rules Management</h1>
      <p className={styles.subheading}>Create and manage Visitor, Prisoner, or shared instructions.</p>
      {auth.error || error ? <ErrorAlert>{auth.error || error}</ErrorAlert> : null}
      {success ? <SuccessAlert>{success}</SuccessAlert> : null}
      <div className={styles.filters}>
        <label className={styles.field}>Audience filter
          <select value={audienceFilter} onChange={(event) => setAudienceFilter(event.target.value as 'ANY' | JailRule['audience'])}>
            <option value="ANY">All audiences</option><option value="VISITOR">Visitor</option><option value="PRISONER">Prisoner</option><option value="ALL">Shared</option>
          </select>
        </label>
      </div>
      <div className={styles.twoColumns}>
        <section className={styles.card}>
          <h2>{editingId ? 'Edit Rule' : 'Create Rule'}</h2>
          <form className={styles.form} onSubmit={submit}>
            <div className={styles.field}><label htmlFor="rule-title">Title</label><input id="rule-title" maxLength={120} minLength={3} onChange={(event) => setForm({ ...form, title: event.target.value })} required value={form.title} /></div>
            <div className={styles.field}><label htmlFor="rule-category">Category</label><input id="rule-category" maxLength={80} minLength={2} onChange={(event) => setForm({ ...form, category: event.target.value })} required value={form.category} /></div>
            <div className={styles.field}><label htmlFor="rule-audience">Audience</label><select id="rule-audience" value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value as JailRule['audience'] })}><option value="VISITOR">Visitor</option><option value="PRISONER">Prisoner</option><option value="ALL">All</option></select></div>
            <div className={styles.field}><label htmlFor="rule-content">Content</label><textarea id="rule-content" maxLength={3000} minLength={10} onChange={(event) => setForm({ ...form, content: event.target.value })} required value={form.content} /></div>
            <div className={styles.field}><label htmlFor="rule-order">Display order</label><input id="rule-order" min={0} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} type="number" value={form.sortOrder} /></div>
            <label><input checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} type="checkbox" /> Active</label>
            <div className={styles.actions}><button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save Rule'}</button>{editingId ? <button className="btn btn-outline-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }} type="button">Cancel</button> : null}</div>
          </form>
        </section>
        <section>
          <h2 className={styles.heading}>Rules</h2>
          {!rules.length ? <EmptyStateAlert>No jail rules match this filter.</EmptyStateAlert> : <div className={styles.grid}>{rules.map((rule) => <article className={styles.card} key={rule.id}><div className={styles.cardHeader}><div><p className={styles.ruleCategory}>{rule.audience} · {rule.category} · Order {rule.sortOrder}</p><h2>{rule.title}</h2></div><span className={`${styles.status} ${rule.isActive ? styles.active : styles.closed}`}>{rule.isActive ? 'Active' : 'Inactive'}</span></div><p className={styles.ruleContent}>{rule.content}</p><div className={styles.actions}><button className="btn btn-outline-primary btn-sm" onClick={() => { setEditingId(rule.id); setForm({ title: rule.title, category: rule.category, content: rule.content, sortOrder: rule.sortOrder, isActive: rule.isActive, audience: rule.audience }); }} type="button">Edit</button><button className="btn btn-outline-secondary btn-sm" onClick={() => void updateJailRule(rule.id, { isActive: !rule.isActive }).then(load)} type="button">{rule.isActive ? 'Deactivate' : 'Activate'}</button></div></article>)}</div>}
        </section>
      </div>
    </div>
  );
}
