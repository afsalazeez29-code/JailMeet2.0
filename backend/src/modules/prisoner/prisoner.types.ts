import type { Role } from '@prisma/client';

export type PrisonerProfileResult = {
  account: {
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    publicId: string | null;
    profilePic: string | null;
  };
  personal: {
    age: number;
    dateOfBirth: string | null;
    gender: string;
    nationality: string | null;
  };
  custody: {
    admissionDate: string;
    cellNumber: string | null;
    jailType: string | null;
    jailName: string | null;
    sentencePeriod: string | null;
  };
  caseInformation: {
    caseDetails: string | null;
  };
  assignedOfficer: {
    name: string;
    publicId: string | null;
  } | null;
  activitySummary: {
    totalParoleRequests: number;
    pendingParoleRequests: number;
    approvedParoleRequests: number;
    rejectedParoleRequests: number;
    totalAppointments: number;
    upcomingApprovedVisits: number;
    completedVisits: number;
  };
  firRecords: Array<{
    firNumber: string;
    description: string | null;
    dateFiled: string;
  }>;
  medicalRecords: Array<{
    bloodGroup: string | null;
    allergies: string | null;
    checkupDetails: string | null;
    updatedAt: string;
  }>;
};

export type PrisonerCaseSummaryResult = {
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
