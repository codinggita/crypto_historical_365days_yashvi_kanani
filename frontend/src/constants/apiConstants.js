/**
 * API-level constants — timeout, retry config, header keys, etc.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const REQUEST_TIMEOUT_MS = 10000;

export const TOKEN_KEY = 'token';

export const HEADER_AUTH = 'Authorization';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
};

export const API_VERSION = 'v1';
