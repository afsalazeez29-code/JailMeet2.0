const BASE_URL = 'http://localhost:5000';

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type RegistrationData = {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  visitorProfile?: {
    id?: string;
    name?: string;
    phone?: string;
    address?: string | null;
    state?: string | null;
    zip?: string | null;
  };
};

type LoginData = {
  user?: {
    email?: string;
    role?: string;
  };
  accessToken?: string;
};

const failedTests: string[] = [];
let passed = 0;
let visitorToken = '';

const uniqueEmail = `testvisitor+${Date.now()}@example.com`;
const password = 'visitor123';

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

const record = (name: string, passedTest: boolean, detail?: string): void => {
  if (passedTest) {
    passed += 1;
    console.log(`PASS ${name}`);
    return;
  }

  failedTests.push(detail ? `${name} - ${detail}` : name);
  console.log(`FAIL ${name}${detail ? ` - ${detail}` : ''}`);
};

const authHeader = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
});

const registrationBody = {
  name: 'Test Visitor',
  email: uniqueEmail,
  password,
  phone: '9876543210',
  address: 'Test Address',
  state: 'Kerala',
  zip: '695541',
};

const testSuccessfulRegistration = async (): Promise<void> => {
  const { status, body } = await requestJson<RegistrationData>(
    '/api/auth/register-visitor',
    {
      method: 'POST',
      body: JSON.stringify(registrationBody),
    },
  );

  record(
    'successful visitor registration',
    status === 201 &&
      body.success === true &&
      body.data?.user?.email === uniqueEmail &&
      body.data.user.role === 'VISITOR' &&
      body.data.visitorProfile?.name === registrationBody.name &&
      body.data.visitorProfile.phone === registrationBody.phone,
    `status=${status}, success=${body.success}, message=${body.message}`,
  );
};

const testDuplicateRegistration = async (): Promise<void> => {
  const { status, body } = await requestJson('/api/auth/register-visitor', {
    method: 'POST',
    body: JSON.stringify(registrationBody),
  });

  record(
    'duplicate visitor registration rejected',
    status === 409 &&
      body.success === false &&
      body.message === 'Email already registered',
    `status=${status}, success=${body.success}, message=${body.message}`,
  );
};

const testInvalidRegistration = async (): Promise<void> => {
  const { status, body } = await requestJson('/api/auth/register-visitor', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Invalid Visitor',
      email: 'not-an-email',
      phone: '9876543210',
    }),
  });

  record(
    'invalid visitor registration rejected',
    status === 400 && body.success === false,
    `status=${status}, success=${body.success}, message=${body.message}`,
  );
};

const testLoginRegisteredVisitor = async (): Promise<void> => {
  const { status, body } = await requestJson<LoginData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: uniqueEmail,
      password,
    }),
  });

  const accessToken = body.data?.accessToken;

  if (accessToken) {
    visitorToken = accessToken;
  }

  record(
    'registered visitor login',
    status === 200 &&
      body.success === true &&
      typeof accessToken === 'string' &&
      accessToken.length > 0 &&
      body.data?.user?.role === 'VISITOR',
    `status=${status}, success=${body.success}, role=${body.data?.user?.role}`,
  );
};

const testVisitorDashboardAccess = async (): Promise<void> => {
  const { status, body } = await requestJson('/api/dashboard/visitor', {
    headers: authHeader(visitorToken),
  });

  record(
    'registered visitor can access visitor dashboard',
    status === 200 && body.success === true,
    `status=${status}, success=${body.success}, message=${body.message}`,
  );
};

const testAdminDashboardRejection = async (): Promise<void> => {
  const { status, body } = await requestJson('/api/dashboard/admin', {
    headers: authHeader(visitorToken),
  });

  record(
    'registered visitor blocked from admin dashboard',
    status === 403 && body.success === false && body.message === 'Forbidden',
    `status=${status}, success=${body.success}, message=${body.message}`,
  );
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
  console.log(
    `Running JailMeet visitor registration checks against ${BASE_URL}`,
  );
  console.log(`Using test email: ${uniqueEmail}`);

  try {
    await testSuccessfulRegistration();
    await testDuplicateRegistration();
    await testInvalidRegistration();
    await testLoginRegisteredVisitor();
    await testVisitorDashboardAccess();
    await testAdminDashboardRejection();
  } catch (error) {
    record(
      'test runner crashed',
      false,
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    printSummary();
  }
};

void main();
