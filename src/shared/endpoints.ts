const Prefix = 'api/v1'

export const Endpoints = {
  Auth: {
    LOGIN: `${Prefix}/auth/login`,
    LOGIN_WITH_GOOGLE: `${Prefix}/auth/google/login`,
    LOGIN_WITH_FACEBOOK: `${Prefix}/auth/facebook/login`,
    LOGOUT: `${Prefix}/auth/logout`,
    FORGOT_PASSWORD: `${Prefix}/auth/forgot/password`,
    CHANGE_PASSWORD: `${Prefix}/auth/change-password`,
    RESET_PASSWORD: `${Prefix}/auth/reset/password`,
    REFRESH_TOKEN: `${Prefix}/auth/refresh`,
    REGISTER: `${Prefix}/auth/email/register`,
    CONFIRM_EMAIL: `${Prefix}/auth/email/confirm`,
    ME: `${Prefix}/auth/me`,
  },
  Users: {
    CREATE: `${Prefix}/users`,
    UPDATE: `${Prefix}/users/:id`,
    DELETE: `${Prefix}/users/:id`,
    GET_ALL: `${Prefix}/users`,
    GET: `${Prefix}/users/:id`,
  },
  Cv: {
    SEARCH: `${Prefix}/cvs/search`,
    GET_ALL: `${Prefix}/cvs/getAll`,
    GET: `${Prefix}/cvs/get`,
    CREATE: `${Prefix}/cvs/create`,
    UPDATE: `${Prefix}/cvs/update`,
    DELETE: `${Prefix}/cvs/delete`,
  },
}
