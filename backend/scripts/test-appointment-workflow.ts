import prisma from '../src/config/prisma';

const BASE_URL = 'http://localhost:5000';

type Role = 'ADMIN' | 'OFFICER' | 'VISITOR' | 'PRISONER';
type AppointmentStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type LoginData = {
  user?: {
    email?: string;
    role?: Role;
  };
  accessToken?: string;
};

type PrisonerOption = {
  id: string;
  name: string;
};

type AppointmentData = {
  id: string;
  appointmentAt: string;
  reason: string;
  status: AppointmentStatus;
  officerNote: string | null;
  prisoner: PrisonerOption;
  visitor?: {
    id: string;
    name: string;
    phone: string;
  };
};

type RegistrationData = {
  user?: {
    email?: string;
    role?: Role;
  };
};

const failedTests: string[] = [];
const createdAppointmentIds = new Set<string>();
const tempVisitorEmail = `appointment-visitor+${Date.now()}@example.com`;
const tempVisitorPassword = 'visitor123';
let passed = 0;
let visitorToken = '';
let officerToken = '';
let adminToken = '';
let prisonerToken = '';
let tempVisitorToken = '';
let selectedPrisoner: PrisonerOption | null = null;
let approveAppointmentId = '';
let rejectAppointmentId = '';
let tempVisitorAppointmentId = '';

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
  date.setHours(10 + daysFromNow, daysFromNow, 0, 0);

  return date.toISOString();
};

const login = async (
  email: string,
  password: string,
  role: Role,
): Promise<string> => {
  const { status, body } = await requestJson<LoginData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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

const registerTempVisitor = async (): Promise<void> => {
  const { status, body } = await requestJson<RegistrationData>(
    '/api/auth/register-visitor',
    {
      method: 'POST',
      body: JSON.stringify({
        name: 'Appointment Test Visitor',
        email: tempVisitorEmail,
        password: tempVisitorPassword,
        phone: '9876543210',
        address: 'Temporary Address',
        state: 'Kerala',
        zip: '695541',
      }),
    },
  );

  record(
    'register temporary visitor for ownership check',
    status === 201 &&
      body.success === true &&
      body.data?.user?.email === tempVisitorEmail &&
      body.data.user.role === 'VISITOR',
    `status=${status}, success=${body.success}, message=${body.message}`,
  );
};

const loadPrisoners = async (): Promise<void> => {
  const { status, body } = await requestJson<PrisonerOption[]>(
    '/api/visitor/prisoners',
    {
      headers: authHeader(visitorToken),
    },
  );

  selectedPrisoner = body.data?.[0] ?? null;

  record(
    'visitor can list prisoner options',
    status === 200 &&
      body.success === true &&
      Array.isArray(body.data) &&
      Boolean(selectedPrisoner?.id) &&
      Boolean(selectedPrisoner?.name),
    `status=${status}, count=${body.data?.length ?? 0}`,
  );

  const exposesSensitiveFields =
    body.data?.some((prisoner) =>
      Object.keys(prisoner).some(
        (key) => !['id', 'name'].includes(key),
      ),
    ) ?? true;

  record(
    'prisoner options do not expose sensitive fields',
    status === 200 && body.success === true && !exposesSensitiveFields,
    `keys=${JSON.stringify(body.data?.[0] ? Object.keys(body.data[0]) : [])}`,
  );
};

const createAppointment = async (
  token: string,
  appointmentAt: string,
  reason: string,
): Promise<AppointmentData | null> => {
  if (!selectedPrisoner) {
    return null;
  }

  const { status, body } = await requestJson<AppointmentData>(
    '/api/visitor/appointments',
    {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify({
        prisonerId: selectedPrisoner.id,
        appointmentAt,
        reason,
      }),
    },
  );

  const appointment = body.data ?? null;

  if (appointment?.id) {
    createdAppointmentIds.add(appointment.id);
  }

  record(
    `create appointment ${reason}`,
    status === 201 &&
      body.success === true &&
      appointment?.status === 'PENDING' &&
      appointment.prisoner.id === selectedPrisoner.id,
    `status=${status}, success=${body.success}, message=${body.message}`,
  );

  return appointment;
};

const testCreateAndDuplicate = async (): Promise<void> => {
  const appointmentAt = futureIso(7);
  const appointment = await createAppointment(
    visitorToken,
    appointmentAt,
    'Family visit approval test',
  );
  approveAppointmentId = appointment?.id ?? '';

  const duplicate = await requestJson('/api/visitor/appointments', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify({
      prisonerId: selectedPrisoner?.id,
      appointmentAt,
      reason: 'Family visit approval test',
    }),
  });

  record(
    'duplicate pending appointment rejected',
    duplicate.status === 409 && duplicate.body.success === false,
    `status=${duplicate.status}, success=${duplicate.body.success}, message=${duplicate.body.message}`,
  );

  const invalidPast = await requestJson('/api/visitor/appointments', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify({
      prisonerId: selectedPrisoner?.id,
      appointmentAt: new Date(Date.now() - 60_000).toISOString(),
      reason: 'Invalid past visit',
    }),
  });

  record(
    'past appointment date rejected',
    invalidPast.status === 400 && invalidPast.body.success === false,
    `status=${invalidPast.status}, success=${invalidPast.body.success}, message=${invalidPast.body.message}`,
  );

  const invalidBody = await requestJson('/api/visitor/appointments', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify({
      prisonerId: selectedPrisoner?.id,
      appointmentAt: futureIso(9),
      reason: 'bad',
    }),
  });

  record(
    'invalid appointment body rejected',
    invalidBody.status === 400 && invalidBody.body.success === false,
    `status=${invalidBody.status}, success=${invalidBody.body.success}, message=${invalidBody.body.message}`,
  );

  const invalidPrisoner = await requestJson('/api/visitor/appointments', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify({
      prisonerId: 'missing-prisoner-id',
      appointmentAt: futureIso(11),
      reason: 'Invalid prisoner test',
    }),
  });

  record(
    'invalid prisoner ID rejected',
    invalidPrisoner.status === 404 && invalidPrisoner.body.success === false,
    `status=${invalidPrisoner.status}, success=${invalidPrisoner.body.success}, message=${invalidPrisoner.body.message}`,
  );

  const maliciousPayload = await requestJson('/api/visitor/appointments', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify({
      prisonerId: selectedPrisoner?.id,
      appointmentAt: futureIso(12),
      reason: 'Unknown ownership fields test',
      visitorId: 'another-visitor',
      officerId: 'another-officer',
      status: 'ACCEPTED',
      role: 'ADMIN',
    }),
  });

  record(
    'visitor cannot send ownership or status fields',
    maliciousPayload.status === 400 &&
      maliciousPayload.body.success === false,
    `status=${maliciousPayload.status}, success=${maliciousPayload.body.success}, message=${maliciousPayload.body.message}`,
  );
};

const testVisitorListAndOwnership = async (): Promise<void> => {
  const rejectAppointment = await createAppointment(
    visitorToken,
    futureIso(8),
    'Family visit rejection test',
  );
  rejectAppointmentId = rejectAppointment?.id ?? '';

  const tempAppointment = await createAppointment(
    tempVisitorToken,
    futureIso(10),
    'Temporary visitor ownership test',
  );
  tempVisitorAppointmentId = tempAppointment?.id ?? '';

  const { status, body } = await requestJson<AppointmentData[]>(
    '/api/visitor/appointments',
    {
      headers: authHeader(visitorToken),
    },
  );

  const appointmentIds = body.data?.map((appointment) => appointment.id) ?? [];

  record(
    'visitor can list own appointments only',
    status === 200 &&
      body.success === true &&
      appointmentIds.includes(approveAppointmentId) &&
      appointmentIds.includes(rejectAppointmentId) &&
      !appointmentIds.includes(tempVisitorAppointmentId),
    `status=${status}, ownCount=${appointmentIds.length}`,
  );
};

const testOfficerListAndReview = async (): Promise<void> => {
  const pending = await requestJson<AppointmentData[]>(
    '/api/officer/appointments?status=PENDING',
    {
      headers: authHeader(officerToken),
    },
  );

  const pendingIds =
    pending.body.data?.map((appointment) => appointment.id) ?? [];

  record(
    'officer can list pending appointments',
    pending.status === 200 &&
      pending.body.success === true &&
      pendingIds.includes(approveAppointmentId) &&
      pendingIds.includes(rejectAppointmentId),
    `status=${pending.status}, pendingCount=${pendingIds.length}`,
  );

  const invalidStatus = await requestJson(
    `/api/officer/appointments/${approveAppointmentId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'INVALID',
      }),
    },
  );

  record(
    'invalid review status rejected',
    invalidStatus.status === 400 && invalidStatus.body.success === false,
    `status=${invalidStatus.status}, success=${invalidStatus.body.success}, message=${invalidStatus.body.message}`,
  );

  const pendingStatus = await requestJson(
    `/api/officer/appointments/${approveAppointmentId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'PENDING',
      }),
    },
  );

  record(
    'PENDING review status rejected',
    pendingStatus.status === 400 && pendingStatus.body.success === false,
    `status=${pendingStatus.status}, success=${pendingStatus.body.success}, message=${pendingStatus.body.message}`,
  );

  const approved = await requestJson<AppointmentData>(
    `/api/officer/appointments/${approveAppointmentId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'ACCEPTED',
        officerNote: 'Approved for test workflow',
      }),
    },
  );

  record(
    'officer approves pending appointment',
    approved.status === 200 &&
      approved.body.success === true &&
      approved.body.data?.status === 'ACCEPTED' &&
      approved.body.data.officerNote === 'Approved for test workflow',
    `status=${approved.status}, success=${approved.body.success}, appointmentStatus=${approved.body.data?.status}`,
  );

  const rejected = await requestJson<AppointmentData>(
    `/api/officer/appointments/${rejectAppointmentId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'REJECTED',
        officerNote: 'Rejected for test workflow',
      }),
    },
  );

  record(
    'officer rejects pending appointment',
    rejected.status === 200 &&
      rejected.body.success === true &&
      rejected.body.data?.status === 'REJECTED' &&
      rejected.body.data.officerNote === 'Rejected for test workflow',
    `status=${rejected.status}, success=${rejected.body.success}, appointmentStatus=${rejected.body.data?.status}`,
  );

  const secondReview = await requestJson(
    `/api/officer/appointments/${approveAppointmentId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(officerToken),
      body: JSON.stringify({
        status: 'REJECTED',
      }),
    },
  );

  record(
    'reviewed appointment cannot be reviewed again',
    secondReview.status === 409 && secondReview.body.success === false,
    `status=${secondReview.status}, success=${secondReview.body.success}, message=${secondReview.body.message}`,
  );
};

const testOfficerIdentityStored = async (): Promise<void> => {
  const approvedAppointment = await prisma.appointment.findUnique({
    where: { id: approveAppointmentId },
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
    'review stores officer identity from JWT',
    approvedAppointment?.officer?.user.email === 'officer@jailmeet.com',
    `officerEmail=${approvedAppointment?.officer?.user.email ?? 'missing'}`,
  );
};

const testVisitorSeesFinalStatuses = async (): Promise<void> => {
  const { status, body } = await requestJson<AppointmentData[]>(
    '/api/visitor/appointments',
    {
      headers: authHeader(visitorToken),
    },
  );

  const approved = body.data?.find(
    (appointment) => appointment.id === approveAppointmentId,
  );
  const rejected = body.data?.find(
    (appointment) => appointment.id === rejectAppointmentId,
  );

  record(
    'visitor GET reflects approved appointment status',
    status === 200 &&
      body.success === true &&
      approved?.status === 'ACCEPTED',
    `status=${status}, appointmentStatus=${approved?.status ?? 'missing'}`,
  );

  record(
    'visitor GET reflects rejected appointment status and note',
    status === 200 &&
      body.success === true &&
      rejected?.status === 'REJECTED' &&
      rejected.officerNote === 'Rejected for test workflow',
    `status=${status}, appointmentStatus=${rejected?.status ?? 'missing'}, note=${rejected?.officerNote ?? 'missing'}`,
  );

  const leakedPassword =
    JSON.stringify(body.data ?? []).includes('password') ||
    JSON.stringify(body.data ?? []).includes('passwordHash');

  record(
    'appointment responses do not include password fields',
    status === 200 && body.success === true && !leakedPassword,
    `leakedPassword=${leakedPassword}`,
  );
};

const testRbac = async (): Promise<void> => {
  const visitorOfficerAccess = await requestJson('/api/officer/appointments', {
    headers: authHeader(visitorToken),
  });

  record(
    'visitor blocked from officer appointments',
    visitorOfficerAccess.status === 403 &&
      visitorOfficerAccess.body.success === false,
    `status=${visitorOfficerAccess.status}, message=${visitorOfficerAccess.body.message}`,
  );

  const officerVisitorAccess = await requestJson('/api/visitor/prisoners', {
    headers: authHeader(officerToken),
  });

  record(
    'officer blocked from visitor prisoner list',
    officerVisitorAccess.status === 403 &&
      officerVisitorAccess.body.success === false,
    `status=${officerVisitorAccess.status}, message=${officerVisitorAccess.body.message}`,
  );

  const adminVisitorAccess = await requestJson('/api/visitor/appointments', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({
      prisonerId: selectedPrisoner?.id,
      appointmentAt: futureIso(13),
      reason: 'Admin should not book visitor appointment',
    }),
  });

  record(
    'admin blocked from visitor booking endpoint',
    adminVisitorAccess.status === 403 &&
      adminVisitorAccess.body.success === false,
    `status=${adminVisitorAccess.status}, message=${adminVisitorAccess.body.message}`,
  );

  const prisonerVisitorAccess = await requestJson('/api/visitor/appointments', {
    method: 'POST',
    headers: authHeader(prisonerToken),
    body: JSON.stringify({
      prisonerId: selectedPrisoner?.id,
      appointmentAt: futureIso(14),
      reason: 'Prisoner should not book visitor appointment',
    }),
  });

  record(
    'prisoner blocked from visitor booking endpoint',
    prisonerVisitorAccess.status === 403 &&
      prisonerVisitorAccess.body.success === false,
    `status=${prisonerVisitorAccess.status}, message=${prisonerVisitorAccess.body.message}`,
  );

  const adminReview = await requestJson(
    `/api/officer/appointments/${tempVisitorAppointmentId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({
        status: 'ACCEPTED',
      }),
    },
  );

  record(
    'admin blocked from officer review endpoint',
    adminReview.status === 403 && adminReview.body.success === false,
    `status=${adminReview.status}, message=${adminReview.body.message}`,
  );

  const noToken = await requestJson('/api/visitor/appointments');

  record(
    'appointment route rejects missing token',
    noToken.status === 401 && noToken.body.success === false,
    `status=${noToken.status}, message=${noToken.body.message}`,
  );

  const invalidToken = await requestJson('/api/visitor/appointments', {
    headers: authHeader('invalid.token.here'),
  });

  record(
    'appointment route rejects invalid token',
    invalidToken.status === 401 && invalidToken.body.success === false,
    `status=${invalidToken.status}, message=${invalidToken.body.message}`,
  );
};

const cleanup = async (): Promise<void> => {
  if (createdAppointmentIds.size > 0) {
    await prisma.appointment.deleteMany({
      where: {
        id: {
          in: Array.from(createdAppointmentIds),
        },
      },
    });
  }

  await prisma.user.deleteMany({
    where: {
      email: tempVisitorEmail,
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
  console.log(`Running JailMeet appointment workflow checks against ${BASE_URL}`);

  try {
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
    prisonerToken = await login(
      'prisoner@jailmeet.com',
      'prisoner123',
      'PRISONER',
    );
    await registerTempVisitor();
    tempVisitorToken = await login(
      tempVisitorEmail,
      tempVisitorPassword,
      'VISITOR',
    );
    await loadPrisoners();
    await testCreateAndDuplicate();
    await testVisitorListAndOwnership();
    await testOfficerListAndReview();
    await testOfficerIdentityStored();
    await testVisitorSeesFinalStatuses();
    await testRbac();
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
