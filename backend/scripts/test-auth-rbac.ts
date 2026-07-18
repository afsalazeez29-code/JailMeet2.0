const BASE_URL = 'http://localhost:5000';

type Role = 'ADMIN' | 'OFFICER' | 'VISITOR' | 'PRISONER';

type TestUser = {
  key: Lowercase<Role>;
  email: string;
  password: string;
  role: Role;
};

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

type MeData = {
  user?: {
    email?: string;
    role?: Role;
  };
};

const users: TestUser[] = [
  {
    key: 'admin',
    email: 'admin@jailmeet.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    key: 'officer',
    email: 'officer@jailmeet.com',
    password: 'officer123',
    role: 'OFFICER',
  },
  {
    key: 'visitor',
    email: 'visitor@jailmeet.com',
    password: 'visitor123',
    role: 'VISITOR',
  },
  {
    key: 'prisoner',
    email: 'prisoner@jailmeet.com',
    password: 'prisoner123',
    role: 'PRISONER',
  },
];

const tokens = new Map<TestUser['key'], string>();
const failedTests: string[] = [];
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

const expect = (
  name: string,
  condition: boolean,
  detail?: string,
): void => {
  record(name, condition, detail);
};

const authHeader = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
});

const loginUsers = async (): Promise<void> => {
  for (const user of users) {
    const { status, body } = await requestJson<LoginData>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });

    const accessToken = body.data?.accessToken;
    const role = body.data?.user?.role;

    expect(
      `login ${user.role}`,
      status === 200 &&
        body.success === true &&
        typeof accessToken === 'string' &&
        accessToken.length > 0 &&
        role === user.role,
      `status=${status}, success=${body.success}, role=${role}`,
    );

    if (accessToken) {
      tokens.set(user.key, accessToken);
    }
  }
};

const testMeRoutes = async (): Promise<void> => {
  for (const user of users) {
    const token = tokens.get(user.key);

    if (!token) {
      expect(`me ${user.role}`, false, 'missing token from login step');
      continue;
    }

    const { status, body } = await requestJson<MeData>('/api/auth/me', {
      headers: authHeader(token),
    });

    expect(
      `me ${user.role}`,
      status === 200 &&
        body.success === true &&
        body.data?.user?.email === user.email,
      `status=${status}, email=${body.data?.user?.email}`,
    );
  }
};

const testCorrectDashboardAccess = async (): Promise<void> => {
  const cases = [
    { key: 'admin', path: '/api/dashboard/admin', role: 'ADMIN' },
    { key: 'officer', path: '/api/dashboard/officer', role: 'OFFICER' },
    { key: 'visitor', path: '/api/dashboard/visitor', role: 'VISITOR' },
    { key: 'prisoner', path: '/api/dashboard/prisoner', role: 'PRISONER' },
  ] as const;

  for (const testCase of cases) {
    const token = tokens.get(testCase.key);

    if (!token) {
      expect(
        `dashboard correct role ${testCase.role}`,
        false,
        'missing token from login step',
      );
      continue;
    }

    const { status, body } = await requestJson(testCase.path, {
      headers: authHeader(token),
    });

    expect(
      `dashboard correct role ${testCase.role}`,
      status === 200 && body.success === true,
      `status=${status}, success=${body.success}`,
    );
  }
};

const testWrongDashboardAccess = async (): Promise<void> => {
  const cases = [
    {
      key: 'visitor',
      path: '/api/dashboard/admin',
      name: 'visitor blocked from admin dashboard',
      requireForbiddenMessage: true,
    },
    {
      key: 'officer',
      path: '/api/dashboard/visitor',
      name: 'officer blocked from visitor dashboard',
      requireForbiddenMessage: false,
    },
    {
      key: 'prisoner',
      path: '/api/dashboard/officer',
      name: 'prisoner blocked from officer dashboard',
      requireForbiddenMessage: false,
    },
    {
      key: 'admin',
      path: '/api/dashboard/prisoner',
      name: 'admin blocked from prisoner dashboard',
      requireForbiddenMessage: false,
    },
  ] as const;

  for (const testCase of cases) {
    const token = tokens.get(testCase.key);

    if (!token) {
      expect(testCase.name, false, 'missing token from login step');
      continue;
    }

    const { status, body } = await requestJson(testCase.path, {
      headers: authHeader(token),
    });

    const expected =
      status === 403 &&
      body.success === false &&
      (!testCase.requireForbiddenMessage || body.message === 'Forbidden');

    expect(
      testCase.name,
      expected,
      `status=${status}, success=${body.success}, message=${body.message}`,
    );
  }
};

const testTokenRejections = async (): Promise<void> => {
  const noToken = await requestJson('/api/dashboard/admin');

  expect(
    'no-token dashboard rejection',
    noToken.status === 401,
    `status=${noToken.status}, message=${noToken.body.message}`,
  );

  const invalidToken = await requestJson('/api/dashboard/admin', {
    headers: authHeader('invalid.token.here'),
  });

  expect(
    'invalid-token dashboard rejection',
    invalidToken.status === 401,
    `status=${invalidToken.status}, message=${invalidToken.body.message}`,
  );
};

const testInvalidLogins = async (): Promise<void> => {
  const wrongPassword = await requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@jailmeet.com',
      password: 'wrong-password',
    }),
  });

  expect(
    'invalid login wrong password',
    wrongPassword.status === 401 && wrongPassword.body.success === false,
    `status=${wrongPassword.status}, success=${wrongPassword.body.success}`,
  );

  const missingUser = await requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'missing@jailmeet.com',
      password: 'admin123',
    }),
  });

  expect(
    'invalid login missing email',
    missingUser.status === 401 && missingUser.body.success === false,
    `status=${missingUser.status}, success=${missingUser.body.success}`,
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
  console.log(`Running JailMeet auth/RBAC API checks against ${BASE_URL}`);

  try {
    await loginUsers();
    await testMeRoutes();
    await testCorrectDashboardAccess();
    await testWrongDashboardAccess();
    await testTokenRejections();
    await testInvalidLogins();
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
