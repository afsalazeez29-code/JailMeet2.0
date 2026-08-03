'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BellRing, CalendarDays, ClipboardList, FileHeart, FileText, House, LifeBuoy, LockKeyhole, Megaphone, SearchCheck, ShieldAlert, ShieldCheck, UserCheck, UserRound, UsersRound, X } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

import iconStyles from '../../common/LucideIcon.module.css';
import s from './AdminTheme.module.css';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Item = { href: string; label: string; icon: Icon; children?: Array<{ href: string; label: string }> };
const items: Item[] = [
  { href:'/admin/dashboard',label:'Dashboard',icon:House },
  { href:'/admin/users',label:'Users',icon:UsersRound },
  { href:'/admin/visitors',label:'Visitors',icon:UserCheck },
  { href:'/admin/officers',label:'Officers',icon:UserRound },
  { href:'/admin/prisoners',label:'Prisoners',icon:UserRound },
  { href:'/admin/officer-operations',label:'Officer Assignments',icon:ShieldCheck },
  { href:'/admin/appointments',label:'Appointments',icon:CalendarDays },
  { href:'/admin/parole',label:'Parole Requests',icon:FileText },
  { href:'/admin/support-requests',label:'Support',icon:LifeBuoy,children:[{href:'/admin/support-requests',label:'Visitor Support'},{href:'/admin/prisoner-support-requests',label:'Prisoner Support'},{href:'/admin/support-escalations',label:'Escalations'}] },
  { href:'/admin/jail-rules',label:'Jail Rules',icon:ClipboardList },
  { href:'/admin/fir-records',label:'FIR Records',icon:FileText },
  { href:'/admin/health-records',label:'Health Records',icon:FileHeart },
  { href:'/admin/audit-logs',label:'Audit Logs',icon:Activity },
  { href:'/admin/reports',label:'Reports',icon:SearchCheck },
  { href:'/admin/system-integrity',label:'System Integrity',icon:ShieldAlert },
  { href:'/admin/announcements',label:'Announcements',icon:Megaphone },
  { href:'/admin/profile',label:'My Profile',icon:BellRing },
  { href:'/admin/change-password',label:'Change Password',icon:LockKeyhole },
];

export default function AdminSidebar({onCloseSidebar}:{onCloseSidebar:()=>void}){const pathname=usePathname();const active=(item:Item)=>pathname===item.href||pathname.startsWith(`${item.href}/`)||Boolean(item.children?.some((child)=>pathname===child.href||pathname.startsWith(`${child.href}/`)));return <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme" aria-label="Admin navigation"><div className="app-brand demo"><Link href="/" className="app-brand-link" aria-label="JailMeet home"><img src="/images/logos/jmlogo.png" alt="JailMeet home" className="app-brand-logo" style={{maxWidth:'180px',height:'auto'}}/></Link><button className="layout-menu-toggle menu-link text-large ms-auto d-xl-none border-0 bg-transparent p-0" type="button" aria-label="Close sidebar" onClick={onCloseSidebar}><X aria-hidden="true" className={`${iconStyles.icon} ${iconStyles.navbar}`}/></button></div><div className="menu-inner-shadow"/><nav><ul className="menu-inner py-1">{items.map((item)=>{const ItemIcon=item.icon;const isActive=active(item);return <li className={`menu-item${isActive?' active':''}`} key={item.label}><Link href={item.href} className={`menu-link ${s.sidebarItem} ${isActive?s.sidebarItemActive:''}`} onClick={onCloseSidebar}><ItemIcon aria-hidden="true" className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`}/><div>{item.label}</div></Link>{item.children?<ul className="list-unstyled ms-4 mb-2">{item.children.map((child)=><li key={child.href}><Link className={`d-block px-3 py-2 text-decoration-none ${pathname===child.href?'text-primary fw-semibold':'text-dark'}`} href={child.href} onClick={onCloseSidebar}>{child.label}</Link></li>)}</ul>:null}</li>})}</ul></nav></aside>}
