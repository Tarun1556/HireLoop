export const ROLE_HOME = {
  ADMIN: '/admin',
  INTERVIEWER: '/interviewer',
  CANDIDATE: '/candidate',
}

export const homeForRole = (role) => ROLE_HOME[role] ?? '/login'