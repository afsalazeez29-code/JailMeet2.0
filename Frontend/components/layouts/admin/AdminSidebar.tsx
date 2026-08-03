'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, CalendarDays, ChevronDown, ClipboardList, FileHeart, FileText, House, LifeBuoy, LockKeyhole, Megaphone, SearchCheck, ShieldAlert, ShieldCheck, UserRound, UsersRound, X } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

import iconStyles from '../../common/LucideIcon.module.css';
import s from './AdminTheme.module.css';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Item = { href: string; label: string; icon: Icon };
type Category = 'users' | 'support';

const userChildren = [
  { href: '/admin/users', label: 'All Users' },
  { href: '/admin/visitors', label: 'Visitors' },
  { href: '/admin/officers', label: 'Officers' },
  { href: '/admin/prisoners', label: 'Prisoners' },
];
const supportChildren = [
  { href: '/admin/support-requests', label: 'Visitor Support' },
  { href: '/admin/prisoner-support-requests', label: 'Prisoner Support' },
  { href: '/admin/support-escalations', label: 'Escalations' },
];
const beforeUsers: Item[] = [{ href: '/admin/dashboard', label: 'Dashboard', icon: House }];
const afterUsers: Item[] = [
  { href: '/admin/officer-operations', label: 'Officer Assignments', icon: ShieldCheck },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/admin/parole', label: 'Parole Requests', icon: FileText },
];
const afterSupport: Item[] = [
  { href: '/admin/jail-rules', label: 'Jail Rules', icon: ClipboardList },
  { href: '/admin/fir-records', label: 'FIR Records', icon: FileText },
  { href: '/admin/health-records', label: 'Health Records', icon: FileHeart },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: Activity },
  { href: '/admin/reports', label: 'Reports', icon: SearchCheck },
  { href: '/admin/system-integrity', label: 'System Integrity', icon: ShieldAlert },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/profile', label: 'My Profile', icon: UserRound },
  { href: '/admin/change-password', label: 'Change Password', icon: LockKeyhole },
];

export default function AdminSidebar({ onCloseSidebar }: { onCloseSidebar: () => void }) {
  const pathname = usePathname();
  const routeCategory: Category | null = userChildren.some(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    ? 'users'
    : supportChildren.some(({ href }) => pathname === href || pathname.startsWith(`${href}/`)) ? 'support' : null;
  const [open, setOpen] = useState<Category | null>(routeCategory);
  useEffect(() => { if (routeCategory) setOpen(routeCategory); }, [routeCategory]);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const close = () => onCloseSidebar();
  const renderItem = (item: Item) => { const Icon = item.icon; const isActive = active(item.href); return <li className={`menu-item${isActive ? ' active' : ''}`} key={item.href}><Link className={`menu-link ${s.sidebarItem} ${isActive ? s.sidebarItemActive : ''}`} href={item.href} onClick={close}><Icon aria-hidden="true" className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`} /><span>{item.label}</span></Link></li>; };
  const renderCategory = (category: Category, label: string, Icon: Icon, children: typeof userChildren) => {
    const expanded = open === category;
    const isActive = routeCategory === category;
    return <li className={`menu-item ${isActive ? 'active' : ''}`}>
      <button aria-expanded={expanded} className={`menu-link ${s.sidebarItem} ${isActive ? s.sidebarItemActive : ''}`} onClick={() => setOpen(expanded ? null : category)} type="button"><Icon aria-hidden="true" className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`} /><span>{label}</span><ChevronDown aria-hidden="true" className={`${s.submenuChevron} ${expanded ? s.submenuChevronOpen : ''}`} size={16} /></button>
      {expanded ? <ul className={s.submenu}>{children.map((child) => <li key={child.href}><Link className={`${s.submenuItem} ${active(child.href) ? s.submenuItemActive : ''}`} href={child.href} onClick={close}>{child.label}</Link></li>)}</ul> : null}
    </li>;
  };

  return <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme" aria-label="Admin navigation">
    <div className="app-brand demo"><span className="app-brand-link"><img src="/images/logos/jmlogo.png" alt="JailMeet" className="app-brand-logo" style={{ maxWidth: '180px', height: 'auto' }} /></span><button className="layout-menu-toggle menu-link text-large ms-auto d-xl-none border-0 bg-transparent p-0" type="button" aria-label="Close sidebar" onClick={close}><X aria-hidden="true" className={`${iconStyles.icon} ${iconStyles.navbar}`} /></button></div>
    <div className="menu-inner-shadow" />
    <nav><ul className="menu-inner py-1">{beforeUsers.map(renderItem)}{renderCategory('users', 'Users', UsersRound, userChildren)}{afterUsers.map(renderItem)}{renderCategory('support', 'Support', LifeBuoy, supportChildren)}{afterSupport.map(renderItem)}</ul></nav>
  </aside>;
}
