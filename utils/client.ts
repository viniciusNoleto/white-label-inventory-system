import { PayloadBody } from './../shared/types/api';
import _omit from 'lodash-es/omit';
import { ApiReponse } from '../shared/types/api';
import { type FetchOptions, ofetch } from 'ofetch';
import { getCookie } from './cookies';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, useAuthStore } from '../store/auth';

const LOGIN_URL = 'auth/login';
const REFRESH_URL = 'auth/refresh-token';

export const cursusClient = {
  get: getWithoutBodyFunction('GET'),

  post: getWithBodyFunction('POST'),

  put: getWithBodyFunction('PUT'),

  patch: getWithBodyFunction('PATCH'),

  delete: getWithoutBodyFunction('DELETE'),
};

function getUrl(url: string) {
  // eslint-disable-next-line
  return `${process.env.API_BASE_URL}/${url}`;
}

type WithoutBodyFunctionOptions = Omit<FetchOptions, 'method' | 'body'>

const buildWithoutBodyOptions = (method: string, options: WithoutBodyFunctionOptions, token?: string) => ({
  ...options,
  method,
  headers: {
    Authorization: `Bearer ${token ?? getCookie(ACCESS_TOKEN_KEY)}`,
    ...options.headers,
  }
});

function getWithoutBodyFunction(method: string) {
  return async <T>(url: string, options: WithoutBodyFunctionOptions = {}): Promise<ApiReponse<T>> => {
    return await ofetch(getUrl(url), buildWithoutBodyOptions(method, options)).catch(async r => {
      if (r?.response?.status === 401) 
        return handleUnauthorized(r, (token) => ofetch(getUrl(url), buildWithoutBodyOptions(method, options, token)));
      
      throw r.data;
    })
  };
}

type WithBodyFunctionOptions = Omit<FetchOptions, 'method' | 'body'> & PayloadBody<object | FormData>

const buildWithBodyOptions = (method: string, options: WithBodyFunctionOptions, token?: string) => ({
  ..._omit(options, 'body', 'method'),
  method,
  body: options.body,
  headers: {
    Authorization: `Bearer ${token ?? getCookie(ACCESS_TOKEN_KEY)}`,
    ...options.headers,
  }
})

function getWithBodyFunction(method: string) {
  return async <T>(
    url: string,
    options: WithBodyFunctionOptions,
  ): Promise<ApiReponse<T>> => {
    return await ofetch(getUrl(url), buildWithBodyOptions(method, options)).catch(async r => {
      if (r?.response?.status === 401 && url !== LOGIN_URL) 
        return handleUnauthorized(r, (token) => ofetch(getUrl(url), buildWithBodyOptions(method, options, token)));
      
      throw r.data;
    })
  };
}

let isRefreshing = false;
const refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function drainQueue(error: unknown, token: string | null): void {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  refreshQueue.length = 0;
}

async function doTokenRefresh(): Promise<string> {
  const refreshToken = getCookie(REFRESH_TOKEN_KEY);

  if (!refreshToken) throw new Error('No refresh token');

  const res = await ofetch(getUrl(REFRESH_URL), {
    method: 'POST',
    body: { refresh_token: refreshToken },
  });

  const { access_token, refresh_token } = res.data as { access_token: string; refresh_token: string };

  useAuthStore.getState().setTokens({ access_token, refresh_token });

  return access_token;
}

async function handleUnauthorized<T>(
  originalError: unknown,
  retry: (token: string) => Promise<T>,
): Promise<T> {
  if (isRefreshing) {
    return new Promise<T>((resolve, reject) => {
      refreshQueue.push({
        resolve: (token) => resolve(retry(token)),
        reject,
      });
    });
  }

  isRefreshing = true;

  try {
    const newToken = await doTokenRefresh();
    drainQueue(null, newToken);
    return await retry(newToken);
  } catch (refreshError) {
    drainQueue(refreshError, null);
    useAuthStore.getState().clearAuth();
    throw (originalError as any)?.data ?? originalError;
  } finally {
    isRefreshing = false;
  }
}