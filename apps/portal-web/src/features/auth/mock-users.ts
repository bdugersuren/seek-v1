export type PortalRole =
  | "super_admin"
  | "organisation_admin"
  | "assessor"
  | "candidate"
  | "reviewer_hr";

export interface PortalUser {
  id: string;
  email: string;
  name: string;
  status: "ACTIVE";
  role: PortalRole;
  roleLabel: string;
  organisation: string;
  homePath: string;
  mockUser: boolean;
}

interface MockCredential {
  password: string;
  user: PortalUser;
}

export const roleHomePaths: Record<PortalRole, string> = {
  super_admin: "/superadmin/dashboard",
  organisation_admin: "/admin/dashboard",
  assessor: "/assessor/dashboard",
  candidate: "/catalog",
  reviewer_hr: "/results",
};

export const mockCredentials: MockCredential[] = [
  {
    password: "TestPassword123!",
    user: {
      id: "mock-super-admin",
      email: "superadmin@lms.local",
      name: "Super Admin",
      status: "ACTIVE",
      role: "super_admin",
      roleLabel: "Super Admin",
      organisation: "seek.mn Platform",
      homePath: roleHomePaths.super_admin,
      mockUser: true,
    },
  },
  {
    password: "TestPassword123!",
    user: {
      id: "mock-org-admin",
      email: "orgadmin@lms.local",
      name: "Organisation Admin",
      status: "ACTIVE",
      role: "organisation_admin",
      roleLabel: "Organisation Admin",
      organisation: "Demo Organisation",
      homePath: roleHomePaths.organisation_admin,
      mockUser: true,
    },
  },
  {
    password: "TestPassword123!",
    user: {
      id: "mock-assessor",
      email: "assessor@lms.local",
      name: "Assessor",
      status: "ACTIVE",
      role: "assessor",
      roleLabel: "Assessor",
      organisation: "Demo Organisation",
      homePath: roleHomePaths.assessor,
      mockUser: true,
    },
  },
  {
    password: "TestPassword123!",
    user: {
      id: "mock-candidate",
      email: "candidate@lms.local",
      name: "Candidate",
      status: "ACTIVE",
      role: "candidate",
      roleLabel: "Candidate",
      organisation: "Demo Organisation",
      homePath: roleHomePaths.candidate,
      mockUser: true,
    },
  },
  {
    password: "TestPassword123!",
    user: {
      id: "mock-reviewer",
      email: "reviewer@lms.local",
      name: "Reviewer / HR",
      status: "ACTIVE",
      role: "reviewer_hr",
      roleLabel: "Reviewer / HR",
      organisation: "Demo Organisation",
      homePath: roleHomePaths.reviewer_hr,
      mockUser: true,
    },
  },
];

export const mockUserEmails = mockCredentials.map(({ user }) => user.email);

export const backendDemoAccount = {
  email: "tester@seek.local",
  password: "TestPassword123!",
  roleLabel: "Backend Assessor",
  homePath: roleHomePaths.assessor,
};

export function findMockUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    mockCredentials.find(
      (credential) =>
        credential.user.email === normalizedEmail &&
        credential.password === password,
    )?.user || null
  );
}

export function enrichUserWithMockRole(user: {
  email: string;
  id?: string;
  roles?: string[];
  role?: string;
}) {
  const normalizedEmail = user.email.trim().toLowerCase();
  const mockUser = mockCredentials.find(
    (credential) => credential.user.email === normalizedEmail,
  )?.user;

  if (mockUser) {
    return {
      ...mockUser,
      id: user.id || mockUser.id,
      mockUser: false,
    };
  }

  let mappedRole: PortalRole = "candidate";
  let roleLabel = "Candidate";

  const userRoles = user.roles || [];
  if (userRoles.includes("SUPER_ADMIN")) {
    mappedRole = "super_admin";
    roleLabel = "Super Admin";
  } else if (userRoles.includes("ORGANIZATION_ADMIN")) {
    mappedRole = "organisation_admin";
    roleLabel = "Organisation Admin";
  } else if (userRoles.includes("ASSESSOR")) {
    mappedRole = "assessor";
    roleLabel = "Assessor";
  } else if (userRoles.includes("CANDIDATE")) {
    mappedRole = "candidate";
    roleLabel = "Candidate";
  } else if (user.role) {
    mappedRole = user.role as PortalRole;
    roleLabel = user.role;
  }

  return {
    ...user,
    name: user.email,
    status: "ACTIVE" as const,
    role: mappedRole,
    roleLabel,
    organisation: "Demo Organisation",
    homePath: roleHomePaths[mappedRole] || "/catalog",
    mockUser: false,
  };
}

export const MOCK_SESSION_STORAGE_KEY = "seek.portal.mockUser";

export function saveMockSession(user: PortalUser) {
  sessionStorage.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function readMockSession() {
  const raw = sessionStorage.getItem(MOCK_SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PortalUser;
  } catch {
    sessionStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearMockSession() {
  sessionStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
}
