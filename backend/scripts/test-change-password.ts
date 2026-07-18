import bcrypt from 'bcrypt';

import prisma from '../src/config/prisma';

const BASE_URL = 'http://localhost:5000';

type Role = 'ADMIN' | 'OFFICER' | 'VISITOR' | 'PRISONER';
type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
};
type LoginData = {
  user?: { id?: string; email?: string; role?: Role };
  accessToken?: string;
};

const users = [
  { role: 'ADMIN', email: 'admin@jailmeet.com', password: 'admin123', nextPassword: 'admin12345' },
  { role: 'OFFICER', email: 'officer@jailmeet.com', password: 'officer123', nextPassword: 'officer12345' },
  { role: 'VISITOR', email: 'visitor@jailmeet.com', password: 'visitor123', nextPassword: 'visitor12345' },
  { role: 'PRISONER', email: 'prisoner@jailmeet.com', password: 'prisoner123', nextPassword: 'prisoner12345' },
] as const;

const failedTests: string[] = [];
const tokens = new Map<Role, string>();
let passed = 0;

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

const record = (name: string, ok: boolean, detail?: string): void => {
  if (ok) {
    passed += 1;
    console.log(`PASS ${name}`);
    return;
  }
  failedTests.push(detail ? `${name} - ${detail}` : name);
  console.log(`FAIL ${name}${detail ? ` - ${detail}` : ''}`);
};

const containsPassword = (value: unknown): boolean => {
  const text = JSON.stringify(value ?? {});
  return text.includes('"password"') || text.includes('passwordHash') || text.includes('$2');
};

const login = async (email: string, password: string): Promise<{ status: number; token: string; role?: Role }> => {
  const { status, body } = await requestJson<LoginData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return { status, token: body.data?.accessToken ?? '', role: body.data?.user?.role };
};

const changePassword = async (
  token: string,
  body: Record<string, unknown>,
) => requestJson('/api/auth/change-password', {
  method: 'PATCH',
  headers: authHeader(token),
  body: JSON.stringify(body),
});

const hashPassword = async (email: string, password: string) => {
  await prisma.user.update({
    where: { email },
    data: { password: await bcrypt.hash(password, 12), isActive: true },
  });
};

const restoreSeedPasswords = async (): Promise<void> => {
  for (const user of users) {
    await hashPassword(user.email, user.password);
  }
};

const loginSeedUsers = async (): Promise<void> => {
  for (const user of users) {
    const result = await login(user.email, user.password);
    record(
      `login ${user.role} before change`,
      result.status === 200 && result.role === user.role && result.token.length > 0,
      `status=${result.status}, role=${result.role}`,
    );
    if (result.token) tokens.set(user.role, result.token);
  }
};

const testSuccessfulChanges = async (): Promise<void> => {
  for (const user of users) {
    const token = tokens.get(user.role) ?? '';
    const response = await changePassword(token, {
      currentPassword: user.password,
      newPassword: user.nextPassword,
    });
    record(
      `${user.role} can change own password`,
      response.status === 200 && response.body.success === true,
      `status=${response.status}, message=${response.body.message}`,
    );
  }

  const adminResponse = await changePassword(tokens.get('ADMIN') ?? '', {
    currentPassword: users[0].nextPassword,
    newPassword: users[0].password,
  });
  record(
    'correct current password succeeds',
    adminResponse.status === 200 && adminResponse.body.success === true,
    `status=${adminResponse.status}`,
  );
  await changePassword(tokens.get('ADMIN') ?? '', {
    currentPassword: users[0].password,
    newPassword: users[0].nextPassword,
  });
};

const testValidationAndSecurity = async (): Promise<void> => {
  const adminToken = tokens.get('ADMIN') ?? '';

  const wrong = await changePassword(adminToken, {
    currentPassword: 'wrong-password',
    newPassword: 'another123',
  });
  record('incorrect current password returns 400', wrong.status === 400 && wrong.body.success === false, `status=${wrong.status}`);

  const short = await changePassword(adminToken, {
    currentPassword: users[0].nextPassword,
    newPassword: 'short',
  });
  record('too-short new password returns 400', short.status === 400 && short.body.success === false, `status=${short.status}`);

  const same = await changePassword(adminToken, {
    currentPassword: users[0].nextPassword,
    newPassword: users[0].nextPassword,
  });
  record('new password same as old returns 400', same.status === 400 && same.body.success === false, `status=${same.status}`);

  for (const [name, body] of [
    ['missing current password returns 400', { newPassword: 'another123' }],
    ['missing new password returns 400', { currentPassword: users[0].nextPassword }],
    ['empty body returns 400', {}],
    ['unknown fields are rejected', { currentPassword: users[0].nextPassword, newPassword: 'another123', extra: true }],
    ['userId in body is rejected', { currentPassword: users[0].nextPassword, newPassword: 'another123', userId: 'someone-else' }],
    ['role in body is rejected', { currentPassword: users[0].nextPassword, newPassword: 'another123', role: 'ADMIN' }],
    ['passwordHash in body is rejected', { currentPassword: users[0].nextPassword, newPassword: 'another123', passwordHash: 'hash' }],
  ] as const) {
    const response = await changePassword(adminToken, body);
    record(name, response.status === 400 && response.body.success === false, `status=${response.status}`);
  }

  const noToken = await requestJson('/api/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword: 'x', newPassword: 'another123' }),
  });
  record('no token returns 401', noToken.status === 401 && noToken.body.success === false, `status=${noToken.status}`);

  const invalidToken = await changePassword('invalid.token.here', {
    currentPassword: 'x',
    newPassword: 'another123',
  });
  record('invalid token returns 401', invalidToken.status === 401 && invalidToken.body.success === false, `status=${invalidToken.status}`);

  await prisma.user.update({ where: { email: users[0].email }, data: { isActive: false } });
  const inactive = await changePassword(adminToken, {
    currentPassword: users[0].nextPassword,
    newPassword: 'inactive123',
  });
  record('inactive user is rejected with 403', inactive.status === 403 && inactive.body.success === false, `status=${inactive.status}`);
  await prisma.user.update({ where: { email: users[0].email }, data: { isActive: true } });

  record('response excludes password', !containsPassword(wrong.body), 'password leaked');
  record('response excludes password hash', !containsPassword(same.body), 'hash leaked');
};

const testLoginEffects = async (): Promise<void> => {
  for (const user of users) {
    const oldLogin = await login(user.email, user.password);
    record(
      `${user.role} old password no longer logs in`,
      oldLogin.status === 401,
      `status=${oldLogin.status}`,
    );
    const newLogin = await login(user.email, user.nextPassword);
    record(
      `${user.role} new password successfully logs in`,
      newLogin.status === 200 && newLogin.role === user.role,
      `status=${newLogin.status}, role=${newLogin.role}`,
    );
  }

  const visitorLogin = await login(users[2].email, users[2].nextPassword);
  record(
    "changing one user's password does not affect another user",
    visitorLogin.status === 200 && visitorLogin.role === 'VISITOR',
    `status=${visitorLogin.status}`,
  );
};

const verifyRestore = async (): Promise<void> => {
  for (const user of users) {
    const result = await login(user.email, user.password);
    record(
      `${user.role} original password restored`,
      result.status === 200 && result.role === user.role,
      `status=${result.status}, role=${result.role}`,
    );
  }
};

const printSummary = (): void => {
  console.log('============================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failedTests.length} failed`);
  console.log('============================');
  if (failedTests.length > 0) {
    console.log('Failed tests:');
    for (const failedTest of failedTests) console.log(`- ${failedTest}`);
    process.exitCode = 1;
  }
};

const main = async (): Promise<void> => {
  console.log(`Running JailMeet change-password checks against ${BASE_URL}`);
  try {
    await restoreSeedPasswords();
    await loginSeedUsers();
    await testSuccessfulChanges();
    await testValidationAndSecurity();
    await testLoginEffects();
  } catch (error) {
    record('test runner crashed', false, error instanceof Error ? error.message : String(error));
  } finally {
    await restoreSeedPasswords().catch((error: unknown) => {
      record('password restore failed', false, error instanceof Error ? error.message : String(error));
    });
    await verifyRestore().catch((error: unknown) => {
      record('password restore verification failed', false, error instanceof Error ? error.message : String(error));
    });
    await prisma.$disconnect();
    printSummary();
  }
};

void main();
