const BASE_URL = 'http://localhost:5000';

type Role = 'ADMIN' | 'OFFICER' | 'VISITOR' | 'PRISONER';

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

type VisitorProfileData = {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: Role;
    password?: string;
    passwordHash?: string;
  };
  visitorProfile?: {
    phone?: string;
    address?: string | null;
    state?: string | null;
    zip?: string | null;
    password?: string;
    passwordHash?: string;
  };
};

const users = {
  admin: {
    email: 'admin@jailmeet.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  officer: {
    email: 'officer@jailmeet.com',
    password: 'officer123',
    role: 'OFFICER',
  },
  visitor: {
    email: 'visitor@jailmeet.com',
    password: 'visitor123',
    role: 'VISITOR',
  },
  prisoner: {
    email: 'prisoner@jailmeet.com',
    password: 'prisoner123',
    role: 'PRISONER',
  },
} as const;

const tokens = new Map<keyof typeof users, string>();
const failedTests: string[] = [];
let passed = 0;
let originalProfile: Required<
  NonNullable<VisitorProfileData['visitorProfile']>
> | null = null;

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

const loginUsers = async (): Promise<void> => {
  for (const [key, user] of Object.entries(users) as Array<
    [keyof typeof users, (typeof users)[keyof typeof users]]
  >) {
    const { status, body } = await requestJson<LoginData>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });

    const accessToken = body.data?.accessToken;

    record(
      `login ${user.role}`,
      status === 200 &&
        body.success === true &&
        typeof accessToken === 'string' &&
        accessToken.length > 0,
      `status=${status}, success=${body.success}`,
    );

    if (accessToken) {
      tokens.set(key, accessToken);
    }
  }
};

const getVisitorProfile = async (
  token: string,
): Promise<{ status: number; body: ApiResponse<VisitorProfileData> }> =>
  requestJson<VisitorProfileData>('/api/visitor/profile', {
    headers: authHeader(token),
  });

const patchVisitorProfile = async (
  token: string,
  body: unknown,
): Promise<{ status: number; body: ApiResponse<VisitorProfileData> }> =>
  requestJson<VisitorProfileData>('/api/visitor/profile', {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify(body),
  });

const testVisitorCanFetchProfile = async (): Promise<void> => {
  const token = tokens.get('visitor');

  if (!token) {
    record('visitor can fetch own profile', false, 'missing visitor token');
    return;
  }

  const { status, body } = await getVisitorProfile(token);
  const profile = body.data?.visitorProfile;

  if (profile?.phone) {
    originalProfile = {
      phone: profile.phone,
      address: profile.address ?? '',
      state: profile.state ?? '',
      zip: profile.zip ?? '',
      password: '',
      passwordHash: '',
    };
  }

  record(
    'visitor can fetch own profile',
    status === 200 &&
      body.success === true &&
      body.data?.user?.role === 'VISITOR' &&
      typeof profile?.phone === 'string',
    `status=${status}, success=${body.success}, role=${body.data?.user?.role}`,
  );
};

const testVisitorReceivesUserAndProfile = async (): Promise<void> => {
  const token = tokens.get('visitor');

  if (!token) {
    record('visitor receives user and profile', false, 'missing visitor token');
    return;
  }

  const { status, body } = await getVisitorProfile(token);

  record(
    'visitor receives user and profile',
    status === 200 &&
      typeof body.data?.user?.id === 'string' &&
      typeof body.data.user.email === 'string' &&
      typeof body.data.visitorProfile?.phone === 'string',
    `status=${status}`,
  );
};

const testPatchCases = async (): Promise<void> => {
  const token = tokens.get('visitor');

  if (!token) {
    record('visitor profile patch cases', false, 'missing visitor token');
    return;
  }

  const phoneUpdate = await patchVisitorProfile(token, {
    phone: '9876543211',
  });
  record(
    'visitor can update phone',
    phoneUpdate.status === 200 &&
      phoneUpdate.body.data?.visitorProfile?.phone === '9876543211',
    `status=${phoneUpdate.status}`,
  );

  const addressUpdate = await patchVisitorProfile(token, {
    address: 'Updated Address',
  });
  record(
    'visitor can update address',
    addressUpdate.status === 200 &&
      addressUpdate.body.data?.visitorProfile?.address === 'Updated Address',
    `status=${addressUpdate.status}`,
  );

  const stateUpdate = await patchVisitorProfile(token, {
    state: 'Kerala',
  });
  record(
    'visitor can update state',
    stateUpdate.status === 200 &&
      stateUpdate.body.data?.visitorProfile?.state === 'Kerala',
    `status=${stateUpdate.status}`,
  );

  const zipUpdate = await patchVisitorProfile(token, {
    zip: '695541',
  });
  record(
    'visitor can update zip',
    zipUpdate.status === 200 &&
      zipUpdate.body.data?.visitorProfile?.zip === '695541',
    `status=${zipUpdate.status}`,
  );

  const partialUpdate = await patchVisitorProfile(token, {
    phone: '9876543212',
    zip: '695542',
  });
  record(
    'partial PATCH works',
    partialUpdate.status === 200 &&
      partialUpdate.body.data?.visitorProfile?.phone === '9876543212' &&
      partialUpdate.body.data.visitorProfile.zip === '695542',
    `status=${partialUpdate.status}`,
  );
};

const testInvalidPayloads = async (): Promise<void> => {
  const token = tokens.get('visitor');

  if (!token) {
    record('invalid payload tests', false, 'missing visitor token');
    return;
  }

  const invalidPhone = await patchVisitorProfile(token, { phone: '123' });
  record(
    'invalid phone returns 400',
    invalidPhone.status === 400 && invalidPhone.body.success === false,
    `status=${invalidPhone.status}`,
  );

  const invalidZip = await patchVisitorProfile(token, { zip: '123' });
  record(
    'invalid zip returns 400',
    invalidZip.status === 400 && invalidZip.body.success === false,
    `status=${invalidZip.status}`,
  );

  const emptyPatch = await patchVisitorProfile(token, {});
  record(
    'empty PATCH returns 400',
    emptyPatch.status === 400 && emptyPatch.body.success === false,
    `status=${emptyPatch.status}`,
  );

  const forbiddenFields = await patchVisitorProfile(token, {
    userId: 'another-user',
    role: 'ADMIN',
    password: 'test123',
  });
  record(
    'userId role password fields rejected',
    forbiddenFields.status === 400 && forbiddenFields.body.success === false,
    `status=${forbiddenFields.status}`,
  );
};

const testTokenAndRoleRejections = async (): Promise<void> => {
  const noToken = await requestJson('/api/visitor/profile');
  record(
    'no token returns 401',
    noToken.status === 401,
    `status=${noToken.status}`,
  );

  const invalidToken = await requestJson('/api/visitor/profile', {
    headers: authHeader('invalid.token.here'),
  });
  record(
    'invalid token returns 401',
    invalidToken.status === 401,
    `status=${invalidToken.status}`,
  );

  for (const roleKey of ['admin', 'officer', 'prisoner'] as const) {
    const token = tokens.get(roleKey);

    if (!token) {
      record(`${users[roleKey].role} returns 403`, false, 'missing token');
      continue;
    }

    const response = await requestJson('/api/visitor/profile', {
      headers: authHeader(token),
    });

    record(
      `${users[roleKey].role} returns 403`,
      response.status === 403,
      `status=${response.status}`,
    );
  }
};

const testPasswordFieldsAreNotReturned = async (): Promise<void> => {
  const token = tokens.get('visitor');

  if (!token) {
    record('response never contains password', false, 'missing visitor token');
    return;
  }

  const { body } = await getVisitorProfile(token);
  const serialized = JSON.stringify(body);

  record(
    'response never contains password or passwordHash',
    !serialized.includes('password') && !serialized.includes('passwordHash'),
  );
};

const testGetAfterPatchPersists = async (): Promise<void> => {
  const token = tokens.get('visitor');

  if (!token) {
    record('GET after PATCH returns persisted data', false, 'missing token');
    return;
  }

  await patchVisitorProfile(token, {
    phone: '9876543213',
    address: 'Persisted Address',
    state: 'Kerala',
    zip: '695543',
  });
  const { status, body } = await getVisitorProfile(token);
  const profile = body.data?.visitorProfile;

  record(
    'GET after PATCH returns persisted updated data',
    status === 200 &&
      profile?.phone === '9876543213' &&
      profile.address === 'Persisted Address' &&
      profile.state === 'Kerala' &&
      profile.zip === '695543',
    `status=${status}, profile=${JSON.stringify(profile)}`,
  );
};

const restoreOriginalProfile = async (): Promise<void> => {
  const token = tokens.get('visitor');

  if (!token || !originalProfile) {
    return;
  }

  await patchVisitorProfile(token, {
    phone: originalProfile.phone,
    address: originalProfile.address,
    state: originalProfile.state,
    zip: originalProfile.zip,
  });
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
  console.log(`Running JailMeet visitor profile checks against ${BASE_URL}`);

  try {
    await loginUsers();
    await testVisitorCanFetchProfile();
    await testVisitorReceivesUserAndProfile();
    await testPatchCases();
    await testInvalidPayloads();
    await testTokenAndRoleRejections();
    await testPasswordFieldsAreNotReturned();
    await testGetAfterPatchPersists();
  } catch (error) {
    record(
      'test runner crashed',
      false,
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    await restoreOriginalProfile().catch((error) => {
      console.warn(
        `WARN failed to restore original visitor profile: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    });
    printSummary();
  }
};

void main();
