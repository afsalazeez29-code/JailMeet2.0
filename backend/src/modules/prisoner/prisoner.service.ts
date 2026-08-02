import { AppointmentStatus, ParoleStatus } from '@prisma/client';

import prisma from '../../config/prisma';
import type {
  PrisonerCaseSummaryResult,
  PrisonerProfileResult,
} from './prisoner.types';

const toDate = (date: Date): string => date.toISOString().slice(0, 10);

export const getPrisonerProfile = async (
  userId: string,
): Promise<PrisonerProfileResult | null> => {
  const prisonerWhere = { prisoner: { userId } };
  const [
    profile,
    pendingParoleRequests,
    approvedParoleRequests,
    rejectedParoleRequests,
    upcomingApprovedVisits,
    completedVisits,
  ] = await prisma.$transaction([
    prisma.prisonerProfile.findUnique({
      where: { userId },
      select: {
        publicId: true,
        name: true,
        age: true,
        dateOfBirth: true,
        gender: true,
        nationality: true,
        admissionDate: true,
        cellNumber: true,
        caseDetails: true,
        sentencePeriod: true,
        jailType: true,
        jailName: true,
        profilePic: true,
        user: {
          select: { email: true, role: true, isActive: true },
        },
        createdByOfficer: {
          select: { name: true, publicId: true },
        },
        firRecords: {
          orderBy: { dateFiled: 'desc' },
          select: {
            firNumber: true,
            description: true,
            dateFiled: true,
          },
        },
        medicalRecords: {
          orderBy: { updatedAt: 'desc' },
          select: {
            bloodGroup: true,
            allergies: true,
            checkupDetails: true,
            updatedAt: true,
          },
        },
        _count: {
          select: { paroleRequests: true, appointments: true },
        },
      },
    }),
    prisma.paroleRequest.count({
      where: { ...prisonerWhere, status: ParoleStatus.PENDING },
    }),
    prisma.paroleRequest.count({
      where: { ...prisonerWhere, status: ParoleStatus.ACCEPTED },
    }),
    prisma.paroleRequest.count({
      where: { ...prisonerWhere, status: ParoleStatus.REJECTED },
    }),
    prisma.appointment.count({
      where: {
        ...prisonerWhere,
        status: AppointmentStatus.ACCEPTED,
        requestedDate: { gte: new Date() },
      },
    }),
    prisma.appointment.count({
      where: { ...prisonerWhere, status: AppointmentStatus.COMPLETED },
    }),
  ]);

  if (!profile) return null;

  return {
    account: {
      name: profile.name,
      email: profile.user.email ?? '',
      role: profile.user.role,
      isActive: profile.user.isActive,
      publicId: profile.publicId,
      profilePic: profile.profilePic,
    },
    personal: {
      age: profile.age,
      dateOfBirth: profile.dateOfBirth ? toDate(profile.dateOfBirth) : null,
      gender: profile.gender,
      nationality: profile.nationality,
    },
    custody: {
      admissionDate: toDate(profile.admissionDate),
      cellNumber: profile.cellNumber,
      jailType: profile.jailType,
      jailName: profile.jailName,
      sentencePeriod: profile.sentencePeriod,
    },
    caseInformation: {
      caseDetails: profile.caseDetails,
    },
    assignedOfficer: profile.createdByOfficer
      ? {
          name: profile.createdByOfficer.name,
          publicId: profile.createdByOfficer.publicId,
        }
      : null,
    activitySummary: {
      totalParoleRequests: profile._count.paroleRequests,
      pendingParoleRequests,
      approvedParoleRequests,
      rejectedParoleRequests,
      totalAppointments: profile._count.appointments,
      upcomingApprovedVisits,
      completedVisits,
    },
    firRecords: profile.firRecords.map((record) => ({
      firNumber: record.firNumber,
      description: record.description,
      dateFiled: toDate(record.dateFiled),
    })),
    medicalRecords: profile.medicalRecords.map((record) => ({
      bloodGroup: record.bloodGroup,
      allergies: record.allergies,
      checkupDetails: record.checkupDetails,
      updatedAt: record.updatedAt.toISOString(),
    })),
  };
};

export const getPrisonerCaseSummary = async (
  userId: string,
): Promise<PrisonerCaseSummaryResult | null> => {
  const profile = await prisma.prisonerProfile.findUnique({
    where: { userId },
    select: {
      publicId: true,
      caseDetails: true,
      sentencePeriod: true,
      admissionDate: true,
      jailType: true,
      jailName: true,
      cellNumber: true,
      createdByOfficer: {
        select: { name: true, publicId: true },
      },
    },
  });

  if (!profile) return null;

  return {
    publicId: profile.publicId,
    caseDetails: profile.caseDetails,
    sentencePeriod: profile.sentencePeriod,
    admissionDate: toDate(profile.admissionDate),
    jailType: profile.jailType,
    jailName: profile.jailName,
    cellNumber: profile.cellNumber,
    assignedOfficer: profile.createdByOfficer
      ? {
          name: profile.createdByOfficer.name,
          publicId: profile.createdByOfficer.publicId,
        }
      : null,
  };
};
