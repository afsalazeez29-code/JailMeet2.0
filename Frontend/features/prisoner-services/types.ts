export type PrisonerVisitStatus = 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export type PrisonerVisit = {
  appointmentReference: string;
  appointmentAt: string;
  purpose: string;
  status: PrisonerVisitStatus;
  officerNote: string | null;
  createdAt: string;
  updatedAt: string;
  visitor: {
    publicId: string | null;
    name: string;
  };
};

export type PrisonerVisitHistoryPage = {
  items: PrisonerVisit[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export type PrisonerCaseSummary = {
  publicId: string | null;
  caseDetails: string | null;
  sentencePeriod: string | null;
  admissionDate: string;
  jailType: string | null;
  jailName: string | null;
  cellNumber: string | null;
  assignedOfficer: {
    name: string;
    publicId: string | null;
  } | null;
};

export type PrisonerSupportCategory =
  | 'PAROLE'
  | 'VISITATION'
  | 'CASE_SENTENCE'
  | 'PROFILE_CORRECTION'
  | 'MEDICAL_ASSISTANCE'
  | 'LEGAL_ASSISTANCE'
  | 'TECHNICAL'
  | 'OTHER';

export type SupportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type PrisonerSupportRequest = {
  reference: string;
  category: PrisonerSupportCategory;
  subject: string;
  message: string;
  status: SupportStatus;
  adminReply: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  prisoner?: {
    publicId: string | null;
    name: string;
  };
  escalatedToOfficer?: { publicId: string | null; name: string } | null;
  escalatedAt?: string | null;
  officerHandledAt?: string | null;
  officerResponse?: string | null;
};

export type PrisonerSupportPage = {
  items: PrisonerSupportRequest[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
