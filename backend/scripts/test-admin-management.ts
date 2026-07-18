import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import prisma from '../src/config/prisma';

const BASE_URL = 'http://localhost:5000';
const TEST_PREFIX = `admin-mgmt-${Date.now()}`;
const password = 'admin123';

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type LoginData = {
  user?: { id?: string; email?: string; role?: string };
  accessToken?: string;
};

type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

type Paginated<T> = {
  items: T[];
  pagination: Pagination;
};

type AdminUser = {
  id: string;
  name: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

const failedTests: string[] = [];
const tempEmails = {
  visitor: `${TEST_PREFIX}-visitor@example.com`,
  officer: `${TEST_PREFIX}-officer@example.com`,
  prisoner: `${TEST_PREFIX}-prisoner@example.com`,
  admin: `${TEST_PREFIX}-admin@example.com`,
  createdOfficer: `${TEST_PREFIX}-created-officer@example.com`,
  createdPrisoner: `${TEST_PREFIX}-created-prisoner@example.com`,
  rollbackPrisoner: `${TEST_PREFIX}-rollback-prisoner@example.com`,
};
let passed = 0;
let adminToken = '';
let tempAdminToken = '';
let visitorToken = '';
let officerToken = '';
let prisonerToken = '';
let adminUserId = '';
let tempVisitorUserId = '';
let tempAdminUserId = '';
let createdOfficerId = '';
let createdPrisonerId = '';

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

  return { status: response.status, body };
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

const containsPasswordField = (value: unknown): boolean => {
  const serialized = JSON.stringify(value ?? {});

  return serialized.includes('"password"') || serialized.includes('passwordHash');
};

const createUser = async (role: Role, email: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const name = `${TEST_PREFIX} ${role}`;
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      ...(role === Role.ADMIN
        ? { adminProfile: { create: { name } } }
        : {}),
      ...(role === Role.VISITOR
        ? {
            visitorProfile: {
              create: {
                name,
                phone: '9876543210',
                state: 'Kerala',
                address: 'Test Address',
                zip: '695541',
              },
            },
          }
        : {}),
      ...(role === Role.OFFICER
        ? { officerProfile: { create: { name, phone: '9876543211' } } }
        : {}),
      ...(role === Role.PRISONER
        ? {
            prisonerProfile: {
              create: {
                name,
                age: 35,
                gender: 'Male',
                admissionDate: new Date('2024-01-01T00:00:00.000Z'),
                sentencePeriod: 'Test Sentence',
                jailType: 'Central',
                jailName: 'Test Jail',
                cellNumber: 'A-101',
              },
            },
          }
        : {}),
    },
    select: { id: true },
  });

  return user.id;
};

const setup = async (): Promise<void> => {
  await prisma.user.deleteMany({
    where: { email: { in: Object.values(tempEmails) } },
  });

  tempVisitorUserId = await createUser(Role.VISITOR, tempEmails.visitor);
  await createUser(Role.OFFICER, tempEmails.officer);
  await createUser(Role.PRISONER, tempEmails.prisoner);
  tempAdminUserId = await createUser(Role.ADMIN, tempEmails.admin);
};

const login = async (
  email: string,
  expectedRole: Role,
): Promise<{ token: string; userId: string }> => {
  const { status, body } = await requestJson<LoginData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const token = body.data?.accessToken ?? '';
  const userId = body.data?.user?.id ?? '';

  record(
    `login ${expectedRole} ${email}`,
    status === 200 &&
      body.success === true &&
      body.data?.user?.role === expectedRole &&
      token.length > 0,
    `status=${status}, role=${body.data?.user?.role}`,
  );

  return { token, userId };
};

const testUserEndpoints = async (): Promise<void> => {
  const users = await requestJson<Paginated<AdminUser>>('/api/admin/users', {
    headers: authHeader(adminToken),
  });

  record(
    'admin can fetch users',
    users.status === 200 && users.body.success === true && Array.isArray(users.body.data?.items),
    `status=${users.status}`,
  );
  record(
    'user list excludes password fields',
    !containsPasswordField(users.body),
    'password field leaked',
  );

  const roleFiltered = await requestJson<Paginated<AdminUser>>(
    '/api/admin/users?role=VISITOR',
    { headers: authHeader(adminToken) },
  );
  record(
    'role filtering works',
    roleFiltered.status === 200 &&
      roleFiltered.body.data?.items.every((user) => user.role === Role.VISITOR) === true,
    `status=${roleFiltered.status}`,
  );

  const searchName = await requestJson<Paginated<AdminUser>>(
    `/api/admin/users?search=${encodeURIComponent(TEST_PREFIX)}`,
    { headers: authHeader(adminToken) },
  );
  const searchEmail = await requestJson<Paginated<AdminUser>>(
    `/api/admin/users?search=${encodeURIComponent(tempEmails.visitor)}`,
    { headers: authHeader(adminToken) },
  );
  record(
    'search works by name and email',
    searchName.status === 200 &&
      (searchName.body.data?.items.length ?? 0) > 0 &&
      searchEmail.status === 200 &&
      searchEmail.body.data?.items.some((user) => user.email === tempEmails.visitor) === true,
    `nameStatus=${searchName.status}, emailStatus=${searchEmail.status}`,
  );

  const paginated = await requestJson<Paginated<AdminUser>>(
    '/api/admin/users?page=1&limit=2',
    { headers: authHeader(adminToken) },
  );
  record(
    'pagination works',
    paginated.status === 200 &&
      paginated.body.data?.pagination.page === 1 &&
      paginated.body.data.pagination.limit === 2 &&
      (paginated.body.data.items.length ?? 0) <= 2 &&
      paginated.body.data.pagination.totalPages >= 1,
    `status=${paginated.status}`,
  );

  const invalidRole = await requestJson('/api/admin/users?role=BAD', {
    headers: authHeader(adminToken),
  });
  record(
    'invalid role filter returns 400',
    invalidRole.status === 400 && invalidRole.body.success === false,
    `status=${invalidRole.status}`,
  );

  const invalidPagination = await requestJson('/api/admin/users?page=0', {
    headers: authHeader(adminToken),
  });
  record(
    'invalid pagination values return 400',
    invalidPagination.status === 400 && invalidPagination.body.success === false,
    `status=${invalidPagination.status}`,
  );

  const detail = await requestJson(`/api/admin/users/${tempVisitorUserId}`, {
    headers: authHeader(adminToken),
  });
  record(
    'admin can fetch one user by ID',
    detail.status === 200 && detail.body.success === true && !containsPasswordField(detail.body),
    `status=${detail.status}`,
  );

  const missing = await requestJson(
    '/api/admin/users/00000000-0000-0000-0000-000000000000',
    { headers: authHeader(adminToken) },
  );
  record(
    'missing user returns 404',
    missing.status === 404 && missing.body.success === false,
    `status=${missing.status}`,
  );
};

const testStatusControl = async (): Promise<void> => {
  const deactivate = await requestJson<AdminUser>(
    `/api/admin/users/${tempVisitorUserId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({ isActive: false }),
    },
  );
  record(
    'admin can deactivate a user',
    deactivate.status === 200 &&
      deactivate.body.success === true &&
      deactivate.body.data?.isActive === false,
    `status=${deactivate.status}`,
  );

  const inactiveLogin = await requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: tempEmails.visitor, password }),
  });
  record(
    'inactive user cannot login',
    inactiveLogin.status === 401 && inactiveLogin.body.success === false,
    `status=${inactiveLogin.status}`,
  );

  const reactivate = await requestJson<AdminUser>(
    `/api/admin/users/${tempVisitorUserId}/status`,
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({ isActive: true }),
    },
  );
  record(
    'admin can reactivate a user',
    reactivate.status === 200 &&
      reactivate.body.success === true &&
      reactivate.body.data?.isActive === true,
    `status=${reactivate.status}`,
  );

  const nonAdmin = await requestJson(`/api/admin/users/${tempVisitorUserId}/status`, {
    method: 'PATCH',
    headers: authHeader(visitorToken),
    body: JSON.stringify({ isActive: false }),
  });
  record(
    'non-admin role cannot update status',
    nonAdmin.status === 403 && nonAdmin.body.success === false,
    `status=${nonAdmin.status}`,
  );

  const self = await requestJson(`/api/admin/users/${adminUserId}/status`, {
    method: 'PATCH',
    headers: authHeader(adminToken),
    body: JSON.stringify({ isActive: false }),
  });
  record(
    'admin cannot deactivate themselves',
    self.status === 400 && self.body.success === false,
    `status=${self.status}, message=${self.body.message}`,
  );

  await requestJson(`/api/admin/users/${tempAdminUserId}/status`, {
    method: 'PATCH',
    headers: authHeader(adminToken),
    body: JSON.stringify({ isActive: false }),
  });
  const lastAdmin = await requestJson(`/api/admin/users/${adminUserId}/status`, {
    method: 'PATCH',
    headers: authHeader(tempAdminToken),
    body: JSON.stringify({ isActive: false }),
  });
  record(
    'last-active-admin protection works',
    lastAdmin.status === 400 && lastAdmin.body.success === false,
    `status=${lastAdmin.status}, message=${lastAdmin.body.message}`,
  );

  const extraField = await requestJson(`/api/admin/users/${tempVisitorUserId}/status`, {
    method: 'PATCH',
    headers: authHeader(adminToken),
    body: JSON.stringify({ isActive: true, role: 'ADMIN' }),
  });
  record(
    'unknown extra fields in status body are rejected',
    extraField.status === 400 && extraField.body.success === false,
    `status=${extraField.status}`,
  );
};

const testAuthRbac = async (): Promise<void> => {
  const noToken = await requestJson('/api/admin/users');
  record('no token returns 401', noToken.status === 401, `status=${noToken.status}`);

  const invalidToken = await requestJson('/api/admin/users', {
    headers: authHeader('invalid.token.here'),
  });
  record(
    'invalid token returns 401',
    invalidToken.status === 401,
    `status=${invalidToken.status}`,
  );

  for (const [role, token] of [
    ['visitor', visitorToken],
    ['officer', officerToken],
    ['prisoner', prisonerToken],
  ] as const) {
    const response = await requestJson('/api/admin/users', {
      headers: authHeader(token),
    });
    record(
      `${role} role gets 403 on admin endpoints`,
      response.status === 403 && response.body.success === false,
      `status=${response.status}`,
    );
  }
};

const testLists = async (): Promise<void> => {
  const visitors = await requestJson('/api/admin/visitors', {
    headers: authHeader(adminToken),
  });
  record('admin can fetch visitors list', visitors.status === 200, `status=${visitors.status}`);

  const officers = await requestJson('/api/admin/officers', {
    headers: authHeader(adminToken),
  });
  record('admin can fetch officers list', officers.status === 200, `status=${officers.status}`);

  const prisoners = await requestJson('/api/admin/prisoners', {
    headers: authHeader(adminToken),
  });
  record('admin can fetch prisoners list', prisoners.status === 200, `status=${prisoners.status}`);

  const appointments = await requestJson('/api/admin/appointments', {
    headers: authHeader(adminToken),
  });
  record('admin can fetch appointments list', appointments.status === 200, `status=${appointments.status}`);

  const filteredAppointments = await requestJson('/api/admin/appointments?status=PENDING', {
    headers: authHeader(adminToken),
  });
  record(
    'appointment status filtering works',
    filteredAppointments.status === 200,
    `status=${filteredAppointments.status}`,
  );

  const parole = await requestJson('/api/admin/parole', {
    headers: authHeader(adminToken),
  });
  record('admin can fetch parole requests list', parole.status === 200, `status=${parole.status}`);

  const filteredParole = await requestJson('/api/admin/parole?status=PENDING', {
    headers: authHeader(adminToken),
  });
  record(
    'parole status filtering works',
    filteredParole.status === 200,
    `status=${filteredParole.status}`,
  );

  record(
    'password fields never appear across list responses',
    ![
      visitors.body,
      officers.body,
      prisoners.body,
      appointments.body,
      parole.body,
    ].some(containsPasswordField),
    'password field leaked',
  );
};

const testOfficerCreateUpdate = async (): Promise<void> => {
  const create = await requestJson<{
    user?: { id: string; email: string; role: Role; isActive: boolean };
    officerProfile?: { id: string; name: string; phone: string | null };
  }>('/api/admin/officers', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({
      email: tempEmails.createdOfficer,
      password: 'officer123',
      name: 'Created Test Officer',
      phone: '9999999999',
    }),
  });

  createdOfficerId = create.body.data?.officerProfile?.id ?? '';

  record(
    'admin can create officer',
    create.status === 201 &&
      create.body.success === true &&
      create.body.data?.user?.role === Role.OFFICER &&
      Boolean(createdOfficerId),
    `status=${create.status}, role=${create.body.data?.user?.role}`,
  );

  const storedOfficer = await prisma.user.findUnique({
    where: { email: tempEmails.createdOfficer },
    select: {
      password: true,
      role: true,
      officerProfile: { select: { id: true, name: true } },
    },
  });

  record(
    'officer profile is created',
    storedOfficer?.officerProfile?.id === createdOfficerId,
    `profile=${storedOfficer?.officerProfile?.id ?? 'missing'}`,
  );
  record(
    'officer password is hashed',
    Boolean(storedOfficer?.password) &&
      storedOfficer?.password !== 'officer123' &&
      (await bcrypt.compare('officer123', storedOfficer.password)),
    'password hash check failed',
  );
  record(
    'officer create response excludes password fields',
    !containsPasswordField(create.body),
    'password field leaked',
  );

  const duplicate = await requestJson('/api/admin/officers', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({
      email: tempEmails.createdOfficer,
      password: 'officer123',
      name: 'Duplicate Officer',
    }),
  });
  record(
    'duplicate officer email returns 409',
    duplicate.status === 409 && duplicate.body.success === false,
    `status=${duplicate.status}`,
  );

  const invalid = await requestJson('/api/admin/officers', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({ email: `${TEST_PREFIX}-bad-officer@example.com` }),
  });
  record(
    'invalid officer data returns 400',
    invalid.status === 400 && invalid.body.success === false,
    `status=${invalid.status}`,
  );

  const unknown = await requestJson('/api/admin/officers', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({
      email: `${TEST_PREFIX}-unknown-officer@example.com`,
      password: 'officer123',
      name: 'Unknown Officer',
      role: 'ADMIN',
      isActive: false,
    }),
  });
  record(
    'unknown officer fields are rejected',
    unknown.status === 400 && unknown.body.success === false,
    `status=${unknown.status}`,
  );

  const nonAdmin = await requestJson('/api/admin/officers', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify({
      email: `${TEST_PREFIX}-blocked-officer@example.com`,
      password: 'officer123',
      name: 'Blocked Officer',
    }),
  });
  record(
    'non-admin cannot create officer',
    nonAdmin.status === 403 && nonAdmin.body.success === false,
    `status=${nonAdmin.status}`,
  );

  const update = await requestJson<{ id?: string; name?: string; phone?: string | null }>(
    `/api/admin/officers/${createdOfficerId}`,
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({
        name: 'Updated Test Officer',
        phone: '8888888888',
      }),
    },
  );
  record(
    'admin can edit officer allowed fields',
    update.status === 200 &&
      update.body.success === true &&
      update.body.data?.name === 'Updated Test Officer' &&
      update.body.data.phone === '8888888888',
    `status=${update.status}`,
  );

  const roleEdit = await requestJson(`/api/admin/officers/${createdOfficerId}`, {
    method: 'PATCH',
    headers: authHeader(adminToken),
    body: JSON.stringify({ role: 'ADMIN' }),
  });
  const roleAfter = await prisma.user.findUnique({
    where: { email: tempEmails.createdOfficer },
    select: { role: true },
  });
  record(
    'admin cannot edit officer role',
    roleEdit.status === 400 && roleAfter?.role === Role.OFFICER,
    `status=${roleEdit.status}, role=${roleAfter?.role}`,
  );

  const missing = await requestJson(
    '/api/admin/officers/00000000-0000-0000-0000-000000000000',
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({ name: 'Missing Officer' }),
    },
  );
  record(
    'missing officer returns 404',
    missing.status === 404 && missing.body.success === false,
    `status=${missing.status}`,
  );
};

const prisonerPayload = (email: string) => ({
  email,
  password: 'prisoner123',
  name: 'Created Test Prisoner',
  age: 40,
  gender: 'Male',
  admissionDate: new Date('2025-01-01T00:00:00.000Z').toISOString(),
  caseDetails: 'Automated test case',
  sentencePeriod: '2 years',
  jailType: 'Central',
  jailName: 'Test Jail',
  cellNumber: 'C-202',
});

const testPrisonerCreateUpdate = async (): Promise<void> => {
  const create = await requestJson<{
    user?: { id: string; email: string; role: Role; isActive: boolean };
    prisonerProfile?: { id: string; name: string; age: number; gender: string };
  }>('/api/admin/prisoners', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify(prisonerPayload(tempEmails.createdPrisoner)),
  });

  createdPrisonerId = create.body.data?.prisonerProfile?.id ?? '';

  record(
    'admin can create prisoner',
    create.status === 201 &&
      create.body.success === true &&
      create.body.data?.user?.role === Role.PRISONER &&
      Boolean(createdPrisonerId),
    `status=${create.status}, role=${create.body.data?.user?.role}`,
  );

  const storedPrisoner = await prisma.user.findUnique({
    where: { email: tempEmails.createdPrisoner },
    select: {
      password: true,
      role: true,
      prisonerProfile: { select: { id: true, name: true } },
    },
  });

  record(
    'prisoner profile is created',
    storedPrisoner?.prisonerProfile?.id === createdPrisonerId,
    `profile=${storedPrisoner?.prisonerProfile?.id ?? 'missing'}`,
  );
  record(
    'prisoner password is hashed',
    Boolean(storedPrisoner?.password) &&
      storedPrisoner?.password !== 'prisoner123' &&
      (await bcrypt.compare('prisoner123', storedPrisoner.password)),
    'password hash check failed',
  );
  record(
    'prisoner create response excludes password fields',
    !containsPasswordField(create.body),
    'password field leaked',
  );

  const duplicate = await requestJson('/api/admin/prisoners', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify(prisonerPayload(tempEmails.createdPrisoner)),
  });
  record(
    'duplicate prisoner email returns 409',
    duplicate.status === 409 && duplicate.body.success === false,
    `status=${duplicate.status}`,
  );

  const invalid = await requestJson('/api/admin/prisoners', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({ email: `${TEST_PREFIX}-bad-prisoner@example.com` }),
  });
  record(
    'invalid prisoner data returns 400',
    invalid.status === 400 && invalid.body.success === false,
    `status=${invalid.status}`,
  );

  const unknown = await requestJson('/api/admin/prisoners', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({
      ...prisonerPayload(`${TEST_PREFIX}-unknown-prisoner@example.com`),
      role: 'ADMIN',
      isActive: false,
    }),
  });
  record(
    'unknown prisoner fields are rejected',
    unknown.status === 400 && unknown.body.success === false,
    `status=${unknown.status}`,
  );

  const nonAdmin = await requestJson('/api/admin/prisoners', {
    method: 'POST',
    headers: authHeader(visitorToken),
    body: JSON.stringify(prisonerPayload(`${TEST_PREFIX}-blocked-prisoner@example.com`)),
  });
  record(
    'non-admin cannot create prisoner',
    nonAdmin.status === 403 && nonAdmin.body.success === false,
    `status=${nonAdmin.status}`,
  );

  const update = await requestJson<{ id?: string; name?: string; age?: number; cellNumber?: string | null }>(
    `/api/admin/prisoners/${createdPrisonerId}`,
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({
        name: 'Updated Test Prisoner',
        age: 41,
        cellNumber: 'D-303',
      }),
    },
  );
  record(
    'admin can edit prisoner allowed fields',
    update.status === 200 &&
      update.body.success === true &&
      update.body.data?.name === 'Updated Test Prisoner' &&
      update.body.data.age === 41 &&
      update.body.data.cellNumber === 'D-303',
    `status=${update.status}`,
  );

  const roleEdit = await requestJson(`/api/admin/prisoners/${createdPrisonerId}`, {
    method: 'PATCH',
    headers: authHeader(adminToken),
    body: JSON.stringify({ role: 'ADMIN' }),
  });
  const roleAfter = await prisma.user.findUnique({
    where: { email: tempEmails.createdPrisoner },
    select: { role: true },
  });
  record(
    'admin cannot edit prisoner role',
    roleEdit.status === 400 && roleAfter?.role === Role.PRISONER,
    `status=${roleEdit.status}, role=${roleAfter?.role}`,
  );

  const missing = await requestJson(
    '/api/admin/prisoners/00000000-0000-0000-0000-000000000000',
    {
      method: 'PATCH',
      headers: authHeader(adminToken),
      body: JSON.stringify({ name: 'Missing Prisoner' }),
    },
  );
  record(
    'missing prisoner returns 404',
    missing.status === 404 && missing.body.success === false,
    `status=${missing.status}`,
  );

  const rollback = await requestJson('/api/admin/prisoners', {
    method: 'POST',
    headers: authHeader(adminToken),
    body: JSON.stringify({
      ...prisonerPayload(tempEmails.rollbackPrisoner),
      admissionDate: 'not-a-date',
    }),
  });
  const orphanUser = await prisma.user.findUnique({
    where: { email: tempEmails.rollbackPrisoner },
    select: { id: true },
  });
  record(
    'failed prisoner creation leaves no orphan user',
    rollback.status === 400 && orphanUser === null,
    `status=${rollback.status}, orphan=${Boolean(orphanUser)}`,
  );
};

const cleanup = async (): Promise<void> => {
  await prisma.user.deleteMany({
    where: { email: { in: Object.values(tempEmails) } },
  });
  await prisma.$disconnect();
};

const printSummary = (): void => {
  console.log('============================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failedTests.length} failed`);
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
  console.log(`Running JailMeet admin management checks against ${BASE_URL}`);
  try {
    await setup();
    const adminLogin = await login('admin@jailmeet.com', Role.ADMIN);
    adminToken = adminLogin.token;
    adminUserId = adminLogin.userId;
    tempAdminToken = (await login(tempEmails.admin, Role.ADMIN)).token;
    visitorToken = (await login(tempEmails.visitor, Role.VISITOR)).token;
    officerToken = (await login(tempEmails.officer, Role.OFFICER)).token;
    prisonerToken = (await login(tempEmails.prisoner, Role.PRISONER)).token;
    await testUserEndpoints();
    await testStatusControl();
    await testAuthRbac();
    await testLists();
    await testOfficerCreateUpdate();
    await testPrisonerCreateUpdate();
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
