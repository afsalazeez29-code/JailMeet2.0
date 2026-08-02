'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { isApiServiceError } from '@/types/api';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/visitor-services.service';
import type { NotificationItem } from '../types';
import styles from './NotificationBell.module.css';

const relativeTime = (value: string) => {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function NotificationBell({ defaultHref = '/visitor/dashboard' }: { defaultHref?: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getNotifications(1, 10);
      setItems(data.items);
      setUnreadCount(data.unreadCount);
      setError(null);
    } catch (caught) {
      if (!isApiServiceError(caught) || caught.status !== 401) {
        setError('Notifications are temporarily unavailable.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 45000);
    const handleRefresh = () => void refresh();
    window.addEventListener('jailmeet:notifications-refresh', handleRefresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('jailmeet:notifications-refresh', handleRefresh);
    };
  }, [refresh]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  const readOne = async (item: NotificationItem) => {
    try {
      if (!item.isRead) {
        await markNotificationRead(item.id);
        setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, isRead: true } : entry));
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      setOpen(false);
    } catch (caught) {
      setError(isApiServiceError(caught) ? caught.message : 'Unable to mark notification as read.');
    }
  };

  const readAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (caught) {
      setError(isApiServiceError(caught) ? caught.message : 'Unable to mark notifications as read.');
    }
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        className={styles.button}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Bell aria-hidden="true" size={19} />
        {unreadCount ? <span aria-hidden="true" className={styles.badge}>{Math.min(unreadCount, 99)}</span> : null}
      </button>
      {open ? (
        <section aria-label="Recent notifications" className={styles.dropdown}>
          <div className={styles.header}>
            <h2>Notifications</h2>
            {unreadCount ? <button className={styles.markAll} onClick={() => void readAll()} type="button">Mark all as read</button> : null}
          </div>
          {error ? <p className={styles.state} role="alert">{error}</p> : null}
          {loading && !items.length ? <p className={styles.state}>Loading notifications…</p> : null}
          {!loading && !error && !items.length ? <p className={styles.state}>No notifications yet.</p> : null}
          <ul className={styles.list} role="menu">
            {items.map((item) => (
              <li className={`${styles.item} ${item.isRead ? '' : styles.unread}`} key={item.id} role="none">
                <Link className={styles.link} href={item.link || defaultHref} onClick={() => void readOne(item)} role="menuitem">
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.message}>{item.message}</p>
                  <time className={styles.time} dateTime={item.createdAt}>{relativeTime(item.createdAt)}</time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
