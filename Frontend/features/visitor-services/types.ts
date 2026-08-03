import type { PaginationMeta } from '@/types/api';
import type { AppointmentStatus } from '@features/appointments/types';

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationPage = {
  items: NotificationItem[];
  unreadCount: number;
  pagination: PaginationMeta;
};

export type VisitPassStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'REVOKED';

export type VisitPass = {
  appointmentReference: string;
  passCode: string;
  passStatus: VisitPassStatus;
  issuedAt: string;
  expiresAt: string;
  checkedInAt: string | null;
  appointmentAt: string;
  purpose: string;
  appointmentStatus: AppointmentStatus;
  officerNote: string | null;
  bookedAt: string;
  reportingInstructions: string;
  visitor: { publicId: string | null; name: string };
  prisoner: {
    publicId: string;
    name: string;
    profilePic: string | null;
    jailName: string | null;
  };
};

export type VisitHistoryItem = {
  appointmentReference: string | null;
  appointmentAt: string;
  purpose: string;
  appointmentStatus: AppointmentStatus;
  officerNote: string | null;
  bookedAt: string;
  closedAt: string;
  prisoner: { publicId: string; name: string; profilePic: string | null };
  passStatus: VisitPassStatus | null;
  checkedInAt: string | null;
  changeOutcome: {
    requestType: 'CANCEL' | 'RESCHEDULE';
    status: 'APPROVED' | 'REJECTED';
    officerReply: string | null;
  } | null;
};

export type VisitHistoryPage = {
  items: VisitHistoryItem[];
  pagination: PaginationMeta;
};

export type ChangeRequest = {
  id: string;
  requestType: 'CANCEL' | 'RESCHEDULE';
  requestedAt: string | null;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  officerReply: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  appointment: {
    appointmentAt: string;
    status: AppointmentStatus;
    prisoner: { publicId: string; name: string };
  };
  visitor?: { publicId: string | null; name: string };
};

export type JailRule = {
  reference: string;
  title: string;
  content: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  audience: 'VISITOR' | 'PRISONER' | 'ALL';
  createdAt: string;
  updatedAt: string;
};

export type SupportCategory = 'APPOINTMENT' | 'PROFILE' | 'VISIT_PASS' | 'TECHNICAL' | 'OTHER';
export type SupportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type SupportRequest = {
  reference: string;
  category: SupportCategory;
  subject: string;
  message: string;
  status: SupportStatus;
  adminReply: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  visitor?: { publicId: string | null; name: string };
};

export type SupportRequestPage = {
  items: SupportRequest[];
  pagination: PaginationMeta;
};
