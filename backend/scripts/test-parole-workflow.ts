import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import prisma from '../src/config/prisma';

const BASE_URL = 'http://localhost:5000';
const TEST_PREFIX = `parole-test-${Date.now()}`;
const prisonerEmail = `${TEST_PREFIX}-prisoner@example.com`;
const otherPrisonerEmail = `${TEST_PREFIX}-other-prisoner@example.com`;
const password = 'prisoner123';

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type LoginData = {
  user?: {
    email?: string;
    role?: string;
  };
  accessToken?: string;
};

type ParoleRequestData = {
  id: string;
  relativeName: string;
  relationship: string;
  purpose: string;
  message: string | null;
  fromDate: string;
  toDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  officerReply: string | null;
  createdAt: string;
  updatedAt: string;
};

type OfficerParoleRequestData = ParoleRequestData & {
  prisoner: {
    id: string;
    name: string;
  };
};

const failedTests: string[] = [];
const createdRequestIds = new Set<string>();
const createdUserEmails = [prisonerEmail, otherPrisonerEmail];
let passed = 0;
let prisonerToken = '';
let otherPrisonerToken = '';
let visitorToken = '';
let officerToken = '';
let adminToken = '';
let prisonerRequestId = '';
let rejectedPrisonerRequestId = '';
let otherPrisonerRequestId = '';

const requestJson = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<{ status: number; body: ApiResponse<T> }> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  return {
    status: response.status,
    body,
  };
};

const authHeader = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
});

const record = (name: string, passedTest: boolean, detail?: string): void => {
  if (passedTest) {
    passed += 1;
    console.log(`PASS ${name}`);
    return;
  }

  failedTests.push(detail ? `${name} - ${detail}` : name);
  console.log(`FAIL ${name}${detail ? ` - ${detail}` : ''}`);
};

const futureIso = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(9, 30, 0, 0);

  return date.toISOString();
};

const parolePayload = (daysFromNow: number, purpose: string) => ({
  relativeName: 'Test Relative',
  relationship: 'Brother',
  purpose,
  message: 'Temporary automated parole workflow test',
  fromDate: futureIso(daysFromNow),
  toDate: futureIso(daysFromNow + 3),
});

const createTempPrisoner = async (
  email: string,
  name: string,
): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: Role.PRISONER,
      prisonerProfile: {
        create: {
          name,
          age: 35,
          gender: 'Male',
          admissionDate: new Date('2024-01-01T00:00:00.000Z'),
          sentencePeriod: 'Temporary test sentence',
          jailType: 'Central',
          jailName: 'Test Jail',
          cellNumber: `T-${Math.floor(Math.random() * 10000)}`,
        },
      },
    },
  });
};

const setup = async (): Promise<void> => {
  await prisma.paroleRequest.deleteMany({
    where: {
      prisoner: {
        user: {
          email: {
            in: createdUserEmails,
          },
        },
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: {
        in: createdUserEmails,
      },
    },
  });

  await createTempPrisoner(prisonerEmail, 'Parole Test Prisoner');
  await createTempPrisoner(otherPrisonerEmail, 'Other Parole Test Prisoner');
};

const login = async (
  email: string,
  loginPassword: string,
  role: string,
): Promise<string> => {
  const { status, body } = await requestJson<LoginData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password: loginPassword,
    }),
  });

  const token = body.data?.accessToken ?? '';

  record(
    `login ${role.toLowerCase()} ${email}`,
    status === 200 &&
      body.success === true &&
      body.data?.user?.role === role &&
      token.length > 0,
    `status=${status}, success=${body.success}, role=${body.data?.user?.role}`,
  );

  return token;
};

const testPrisonerCreate = async (): Promise<void> => {
  const payload = parolePayload(
    10,
    'Requesting parole for a family emergency',
  );
  const { status, body } = await requestJson<ParoleRequestData>(
    '/api/prisoner/parole',
    {
      method: 'POST',
      headers: authHeader(prisonerToken),
      body: JSON.stringify(payload),
    },
  );

  if (body.data?.id) {
    prisonerRequestId = body.data.id;
    createdRequestIds.add(body.data.id);
  }

  record(
    'prisoner can submit a parole request',
    status === 201 &&
      body.success === true &&
      body.data?.purpose === payload.purpose,
    `status=${status}, success=${body.success}, message=${body.message}`,
  );

  record(
    'new request status is PENDING',
    body.data?.status === 'PENDING',
    `status=${body.data?.status ?? 'missing'}`,
  );

  const storedRequest = await prisma.paroleRequest.findUnique({
    where: { id: prisonerRequestId },
    select: {
      prisoner: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  record(
    'request belongs to the authenticated prisoner',
    storedRequest?.prisoner.user.email === prisonerEmail,
    `owner=${storedRequest?.prisoner.user.email ?? 'missing'}`,
  );
};

const expectCreateRejected = async (
  name: string,
  payload: Record<string, unknown>,
  expectedStatus: number,
): Promise<void> => {
  const { status, body } = await requestJson('/api/prisoner/parole', {
    method: 'POST',
    headers: authHeader(prisonerToken),
    body: JSON.stringify(payload),
  });

  record(
    name,
    status === expectedStatus && body.success === false,
    `status=${status}, success=${body.success}, message=${body.message}`,
  );
};

const testPrisonerValidationAndDuplicates = async (): Promise<void> => {
  const basePayload = parolePayload(20, 'Validation test parole request');

  await expectCreateRejected(
    'prisoner cannot send prisonerId',
    { ...basePayload, prisonerId: 'fake-prisoner-id' },
    400,
  );
  await expectCreateRejected(
    'prisoner cannot send officerId',
    { ...basePayload, officerId: 'fake-officer-id' },
    400,
  );
  await expectCreateRejected(
    'prisoner cannot set status',
    { ...basePayload, status: 'ACCEPTED' },
    400,
  );
  await expectCreateRejected(
    'invalid too-short purpose is rejected',
    { ...basePayload, purpose: 'short' },
    400,
  );
  await expectCreateRejected(
    'empty purpose is rejected',
    { ...basePayload, purpose: '' },
    400,
  );
  await expectCreateRejected(
    'unknown fields are rejected',
    { ...basePayload, unknownField: 'nope' },
    400,
  );
  await expectCreateRejected(
    'duplicate pending request is rejected',
    parolePayload(22, 'Second pending request should be blocked'),
    409,
  );
};

const testPrisonerGetAndOwnership = async (): Promise<void> => {
  const otherCreate = await requestJson<ParoleRequestData>(
    '/api/prisoner/parole',
    {
      method: 'POST',
      headers: authHeader(otherPrisonerToken),
      body: JSON.stringify(
        parolePayload(30, 'Other prisoner parole ownership request'),
      ),
    },
  );

  if (otherCreate.body.data?.id) {
    otherPrisonerRequestId = otherCreate.body.data.id;
    createdRequestIds.add(otherCreate.body.data.id);
  }

  record(
    'other prisoner setup request created',
    otherCreate.status === 201 && otherCreate.body.success === true,
    `status=${otherCreate.status}, success=${otherCreate.body.success}`,
  );

  const { status, body } = await requestJson<ParoleRequestData[]>(
    '/api/prisoner/parole',
    {
      headers: authHeader(prisonerToken),
    },
  );

  const ids = body.data?.map((request) => request.id) ?? [];

  record(
    'prisoner can fetch own requests',
    status === 200 &&
      body.success === true &&
      ids.includes(prisonerRequestId),
    `status=${status}, ownCount=${ids.length}`,
  );

  record(
    'prisoner cannot see another prisoner requests',
    status === 200 &&
      body.success === true &&
      !ids.includes(otherPrisonerRequestId),
    `otherVisible=${ids.includes(otherPrisonerRequestId)}`,
  );
};

const testAuthAndRbac = async (): Promise<void> => {
  const noToken = await requestJson('/api/prisoner/parole');

  record(
    'no token returns 401',
    noToken.status === 401 && noToken.body.success === false,
    `status=${noToken.status}, message=${noToken.body.message}`,
  );

  const invalidToken = await requestJson('/api/prisoner/parole', {
    headers: authHeader('invalid.token.here'),
  });

  record(
    'invalid token returns 401',
    invalidToken.status === 401 && invalidToken.body.success === false,
    `status=${invalidToken.status}, message=${invalidToken.body.message}`,
  );

  const visitorSubmit = await requestJson('/api/prisoner/parole', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify(parolePayload(40, 'Visitor should not submit parole')),
  });

  record(
    'visitor role cannot submit parole',
    visitorSubmit.status === 403 && visitorSubmit.body.success === false,
    `status=${visitorSubmit.status}, message=${visitorSubmit.body.message}`,
  );

  const officerSubmit = await requestJson('/api/prisoner/parole', {
    method: 'POST',
    headers: authHeader(officerToken),
    body: JSON.stringify(parolePayload(41, 'Officer should not submit parole')),
  });

  record(
    'officer role cannot submit prisoner parole',
    officerSubmit.status === 403 && officerSubmit.body.success === false,
    `status=${officerSubmit.status}, message=${officerSubmit.body.message}`,
  );

  const adminSubmit = await requestJson('/api/prisoner/parole', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify(parolePayload(42, 'Admin should not submit parole')),
  });

  record(
    'admin role cannot submit prisoner parole',
    adminSubmit.status === 403 && adminSubmit.body.success === false,
    `status=${adminSubmit.status}, message=${adminSubmit.body.message}`,
  );
};

const testOfficerListAndRbac = async (): Promise<void> => {
  const pending = await requestJson<OfficerParoleRequestData[]>(
    '/api/officer/parole?status=PENDING',
    {
      headers: authHeader(officerToken),
    },
  );

  const pendingIds = pending.body.data?.map((request) => request.id) ?? [];
  const firstRequest = pending.body.data?.find(
    (request) => request.id === prisonerRequestId,
  );

  record(
    'officer can fetch pending requests',
    pending.status === 200 &&
      pending.body.success === true &&
      pendingIds.includes(prisonerRequestId) &&
      firstRequest?.prisoner.name === 'Parole Test Prisoner',
    `status=${pending.status}, pendingCount=${pendingIds.length}`,
  );

  const invalidFilter = await requestJson('/api/officer/parole?status=INVALID', {
    headers: authHeader(officerToken),
  });

  record(
    'invalid officer status filter is rejected',
    invalidFilter.status === 400 && invalidFilter.body.success === false,
    `status=${invalidFilter.status}, message=${invalidFilter.body.message}`,
  );

  const prisonerOfficerAccess = await requestJson('/api/officer/parole', {
    headers: authHeader(prisonerToken),
  });

  record(
    'prisoner cannot access officer parole endpoint',
    prisonerOfficerAccess.status === 403 &&
      prisonerOfficerAccess.body.success === false,
    `status=${prisonerOfficerAccess.status}, message=${prisonerOfficerAccess.body.message}`,
  );

  const visitorOfficerAccess = await requestJson('/api/officer/parole', {
    headers: authHeader(visitorToken),
  });

  record(
    'visitor cannot access officer parole endpoint',
    visitorOfficerAccess.status === 403 &&
      visitorOfficerAccess.body.success === false,
    `status=${visitorOfficerAccess.status}, message=${visitorOfficerAccess.body.message}`,
  );

  const adminReview = await requestJson(
    `/api/officer/parole/${prisonerRequestId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({
        status: 'ACCEPTED',
      }),
    },
  );

  record(
    'admin cannot review parole requests',
    adminReview.status === 403 && adminReview.body.success === false,
    `status=${adminReview.status}, message=${adminReview.body.message}`,
  );
};

const testOfficerReviewValidation = async (): Promise<void> => {
  const invalidStatus = await requestJson(
    `/api/officer/parole/${prisonerRequestId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'INVALID',
      }),
    },
  );

  record(
    'invalid review status value is rejected',
    invalidStatus.status === 400 && invalidStatus.body.success === false,
    `status=${invalidStatus.status}, message=${invalidStatus.body.message}`,
  );

  const pendingStatus = await requestJson(
    `/api/officer/parole/${prisonerRequestId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'PENDING',
      }),
    },
  );

  record(
    'PENDING review status is rejected',
    pendingStatus.status === 400 && pendingStatus.body.success === false,
    `status=${pendingStatus.status}, message=${pendingStatus.body.message}`,
  );

  const ownershipFields = await requestJson(
    `/api/officer/parole/${prisonerRequestId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'ACCEPTED',
        officerId: 'fake-officer-id',
        prisonerId: 'fake-prisoner-id',
        reason: 'malicious change',
      }),
    },
  );

  record(
    'officer cannot send ownership or reason fields',
    ownershipFields.status === 400 && ownershipFields.body.success === false,
    `status=${ownershipFields.status}, message=${ownershipFields.body.message}`,
  );
};

const testOfficerApproveAndIdentity = async (): Promise<void> => {
  const approved = await requestJson<OfficerParoleRequestData>(
    `/api/officer/parole/${prisonerRequestId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'ACCEPTED',
        replyMessage: 'Approved for automated parole test',
      }),
    },
  );

  record(
    'officer can accept a pending request',
    approved.status === 200 &&
      approved.body.success === true &&
      approved.body.data?.status === 'ACCEPTED' &&
      approved.body.data.officerReply === 'Approved for automated parole test',
    `status=${approved.status}, requestStatus=${approved.body.data?.status}`,
  );

  const storedRequest = await prisma.paroleRequest.findUnique({
    where: { id: prisonerRequestId },
    select: {
      officer: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  record(
    'officer ID is correctly stored from JWT',
    storedRequest?.officer?.user.email === 'officer@jailmeet.com',
    `officerEmail=${storedRequest?.officer?.user.email ?? 'missing'}`,
  );

  const secondReview = await requestJson(
    `/api/officer/parole/${prisonerRequestId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'REJECTED',
      }),
    },
  );

  record(
    'reviewed parole request cannot be reviewed again',
    secondReview.status === 409 && secondReview.body.success === false,
    `status=${secondReview.status}, message=${secondReview.body.message}`,
  );
};

const createSecondPrisonerRequest = async (): Promise<void> => {
  const created = await requestJson<ParoleRequestData>('/api/prisoner/parole', {
    method: 'POST',
    headers: authHeader(prisonerToken),
    body: JSON.stringify(
      parolePayload(50, 'Second parole request for rejection test'),
    ),
  });

  if (created.body.data?.id) {
    rejectedPrisonerRequestId = created.body.data.id;
    createdRequestIds.add(created.body.data.id);
  }

  record(
    'prisoner can submit a second request after approval',
    created.status === 201 &&
      created.body.success === true &&
      created.body.data?.status === 'PENDING',
    `status=${created.status}, requestStatus=${created.body.data?.status}`,
  );
};

const testOfficerReject = async (): Promise<void> => {
  const rejected = await requestJson<OfficerParoleRequestData>(
    `/api/officer/parole/${rejectedPrisonerRequestId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'REJECTED',
        replyMessage: 'Rejected for automated parole test',
      }),
    },
  );

  record(
    'officer can reject a separate pending request',
    rejected.status === 200 &&
      rejected.body.success === true &&
      rejected.body.data?.status === 'REJECTED' &&
      rejected.body.data.officerReply === 'Rejected for automated parole test',
    `status=${rejected.status}, requestStatus=${rejected.body.data?.status}`,
  );
};

const testPrisonerSeesFinalStatuses = async (): Promise<void> => {
  const { status, body } = await requestJson<ParoleRequestData[]>(
    '/api/prisoner/parole',
    {
      headers: authHeader(prisonerToken),
    },
  );

  const approved = body.data?.find(
    (request) => request.id === prisonerRequestId,
  );
  const rejected = body.data?.find(
    (request) => request.id === rejectedPrisonerRequestId,
  );
  const serializedResponse = JSON.stringify(body.data ?? []);
  const leakedPassword =
    serializedResponse.includes('password') ||
    serializedResponse.includes('passwordHash');

  record(
    'prisoner GET reflects accepted status after approval',
    status === 200 &&
      body.success === true &&
      approved?.status === 'ACCEPTED',
    `status=${status}, requestStatus=${approved?.status ?? 'missing'}`,
  );

  record(
    'prisoner GET reflects rejected status after rejection',
    status === 200 &&
      body.success === true &&
      rejected?.status === 'REJECTED',
    `status=${status}, requestStatus=${rejected?.status ?? 'missing'}`,
  );

  record(
    'officer reply message is visible to prisoner',
    approved?.officerReply === 'Approved for automated parole test' &&
      rejected?.officerReply === 'Rejected for automated parole test',
    `approvedReply=${approved?.officerReply ?? 'missing'}, rejectedReply=${rejected?.officerReply ?? 'missing'}`,
  );

  record(
    'parole responses do not include password fields',
    status === 200 && body.success === true && !leakedPassword,
    `leakedPassword=${leakedPassword}`,
  );
};

const cleanup = async (): Promise<void> => {
  if (createdRequestIds.size > 0) {
    await prisma.paroleRequest.deleteMany({
      where: {
        id: {
          in: Array.from(createdRequestIds),
        },
      },
    });
  }

  await prisma.user.deleteMany({
    where: {
      email: {
        in: createdUserEmails,
      },
    },
  });

  await prisma.$disconnect();
};

const printSummary = (): void => {
  console.log('============================');
  console.log(
    `TEST SUMMARY: ${passed} passed, ${failedTests.length} failed`,
  );
  console.log('============================');

  if (failedTests.length > 0) {
    console.log('Failed tests:');
    for (const failedTest of failedTests) {
      console.log(`- ${failedTest}`);
    }
    process.exitCode = 1;
  }
};

const main = async (): Promise<void> => {
  console.log(`Running JailMeet parole workflow checks against ${BASE_URL}`);

  try {
    await setup();
    prisonerToken = await login(prisonerEmail, password, 'PRISONER');
    otherPrisonerToken = await login(
      otherPrisonerEmail,
      password,
      'PRISONER',
    );
    visitorToken = await login(
      'visitor@jailmeet.com',
      'visitor123',
      'VISITOR',
    );
    officerToken = await login(
      'officer@jailmeet.com',
      'officer123',
      'OFFICER',
    );
    adminToken = await login('admin@jailmeet.com', 'admin123', 'ADMIN');

    await testPrisonerCreate();
    await testPrisonerValidationAndDuplicates();
    await testPrisonerGetAndOwnership();
    await testAuthAndRbac();
    await testOfficerListAndRbac();
    await testOfficerReviewValidation();
    await testOfficerApproveAndIdentity();
    await createSecondPrisonerRequest();
    await testOfficerReject();
    await testPrisonerSeesFinalStatuses();
  } catch (error) {
    record(
      'test runner crashed',
      false,
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    await cleanup().catch((error: unknown) => {
      record(
        'test cleanup failed',
        false,
        error instanceof Error ? error.message : String(error),
      );
    });
    printSummary();
  }
};

void main();
