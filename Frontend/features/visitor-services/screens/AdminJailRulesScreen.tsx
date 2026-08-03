'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { createJailRule, getAdminJailRules, updateJailRule } from '../services/visitor-services.service';
import type { JailRule } from '../types';
import styles from '../components/VisitorServices.module.css';

type RuleForm = Pick<JailRule, 'title' | 'category' | 'content' | 'sortOrder' | 'isActive' | 'audience'>;

const empty: RuleForm = {
  title: '',
  category: '',
  content: '',
  sortOrder: 0,
  isActive: true,
  audience: 'VISITOR',
};

export default function AdminJailRulesScreen() {
  const auth = useProtectedPage();
  const [rules, setRules] = useState<JailRule[]>([]);
  const [form, setForm] = useState<RuleForm>(empty);
  const [filter, setFilter] = useState<'ANY' | JailRule['audience']>('ANY');
  const [activeFilter, setActiveFilter] = useState<'ANY' | 'ACTIVE' | 'INACTIVE'>('ANY');
  const [search, setSearch] = useState('');
  const [previewAudience, setPreviewAudience] = useState<'VISITOR' | 'PRISONER' | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRules(await getAdminJailRules(filter === 'ANY' ? undefined : filter));
      setError(null);
    } catch (caught) {
      setError(isApiServiceError(caught) ? caught.message : 'Unable to load jail rules');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (auth.isReady) void load();
  }, [auth.isReady, load]);

  const filteredRules = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return rules.filter((rule) => {
      const statusMatches = activeFilter === 'ANY'
        || (activeFilter === 'ACTIVE' ? rule.isActive : !rule.isActive);
      const searchMatches = !normalizedSearch || [rule.reference, rule.title, rule.category, rule.content]
        .some((value) => value.toLowerCase().includes(normalizedSearch));
      return statusMatches && searchMatches;
    });
  }, [activeFilter, rules, search]);

  const previewRules = useMemo(() => previewAudience
    ? rules.filter((rule) => rule.isActive && (rule.audience === previewAudience || rule.audience === 'ALL'))
    : [], [previewAudience, rules]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (editing) await updateJailRule(editing, form);
      else await createJailRule(form);
      setSuccess(editing ? 'Jail Rule updated.' : 'Jail Rule created.');
      setEditing(null);
      setForm(empty);
      window.dispatchEvent(new Event('jailmeet:notifications-refresh'));
      await load();
    } catch (caught) {
      setError(isApiServiceError(caught) ? caught.message : 'Unable to save Jail Rule');
    }
  };

  if (auth.isLoading || (loading && !rules.length)) {
    return <div className={styles.page}><LoadingAlert>Loading Jail Rules…</LoadingAlert></div>;
  }
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;

  return <div className={styles.page}>
    <h1 className={styles.heading}>Jail Rules Management</h1>
    <p className={styles.subheading}>Search, audience filtering and audited publication controls.</p>
    {auth.error || error ? <ErrorAlert>{auth.error || error}</ErrorAlert> : null}
    {success ? <SuccessAlert>{success}</SuccessAlert> : null}
    <div className={styles.filters}>
      <label className={styles.field}>Search
        <input
          maxLength={120}
          placeholder="Reference, title, category or content"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <label className={styles.field}>Audience
        <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="ANY">All audiences</option><option>VISITOR</option><option>PRISONER</option><option>ALL</option>
        </select>
      </label>
      <label className={styles.field}>Publication status
        <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value as typeof activeFilter)}>
          <option value="ANY">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
        </select>
      </label>
      <div className={styles.actions}>
        <button className={styles.adminRuleButton} type="button" onClick={() => setPreviewAudience('VISITOR')}>Preview as Visitor</button>
        <button className={styles.adminRuleButton} type="button" onClick={() => setPreviewAudience('PRISONER')}>Preview as Prisoner</button>
      </div>
    </div>
    {previewAudience ? <section className={styles.card} aria-label={`${previewAudience} rule preview`}>
      <div className={styles.actions}><h2>{previewAudience === 'VISITOR' ? 'Visitor' : 'Prisoner'} preview</h2><button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setPreviewAudience(null)}>Close preview</button></div>
      {!previewRules.length ? <p>No active rules are visible to this audience.</p> : previewRules.map((rule) => <article key={rule.reference}><strong>{rule.title}</strong><p>{rule.content}</p></article>)}
    </section> : null}
    <div className={styles.ruleStack}>
      <section className={styles.card}>
        <h2>{editing ? 'Edit Rule' : 'Create Rule'}</h2>
        <form className={styles.form} onSubmit={submit}>
          <label className={styles.field}>Title<input minLength={3} maxLength={120} required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label className={styles.field}>Category<input minLength={2} maxLength={80} required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
          <label className={styles.field}>Audience<select value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value as JailRule['audience'] })}><option>VISITOR</option><option>PRISONER</option><option>ALL</option></select></label>
          <label className={styles.field}>Content<textarea minLength={10} maxLength={3000} required value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></label>
          <label className={styles.field}>Display order<input min={0} type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label>
          <label><input checked={form.isActive} type="checkbox" onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Active</label>
          <div className={styles.actions}>
            <button className={styles.adminRuleButton} type="submit">{editing ? 'Update Rule' : 'Create Rule'}</button>
            {editing ? <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button> : null}
          </div>
        </form>
      </section>
      <section>
        <h2>Rules</h2>
        {!filteredRules.length ? <EmptyStateAlert>No matching rules.</EmptyStateAlert> : <div className={styles.grid}>
          {filteredRules.map((rule) => <article className={styles.card} key={rule.reference}>
            <p className={styles.ruleCategory}>{rule.reference} · {rule.audience} · {rule.category}</p>
            <h2>{rule.title}</h2><p>{rule.content}</p><p>Status: {rule.isActive ? 'Active' : 'Inactive'}</p>
            <div className={styles.actions}>
              <button className={styles.adminRuleButton} type="button" onClick={() => { setEditing(rule.reference); setForm({ title: rule.title, category: rule.category, content: rule.content, sortOrder: rule.sortOrder, isActive: rule.isActive, audience: rule.audience }); }}>Edit</button>
              <button className={styles.adminRuleButton} type="button" onClick={() => void updateJailRule(rule.reference, { isActive: !rule.isActive }).then(load).catch(() => setError('Unable to update Jail Rule'))}>{rule.isActive ? 'Deactivate' : 'Activate'}</button>
              <Link className={styles.adminRuleButton} href={`/admin/audit-logs?entityReference=${encodeURIComponent(rule.reference)}`}>Audit History</Link>
            </div>
          </article>)}
        </div>}
      </section>
    </div>
  </div>;
}
