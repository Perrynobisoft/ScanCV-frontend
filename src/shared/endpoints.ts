const Prefix = 'api/v1'

export const Endpoints = {
  Auth: {
    LOGIN: `${Prefix}/auth/email/login`,
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
    CREATE: `${Prefix}/users/create`,
    UPDATE: `${Prefix}/users/update`,
    DELETE: `${Prefix}/users/delete`,
    GET_ALL: `${Prefix}/users/getAll`,
    GET: `${Prefix}/users/get`,
  },
}
