import { afterEach, describe, expect, it, vi } from 'vitest';
import { authCookieOptions, readBrowserCookies, SESSION_DAYS, writeBrowserCookie } from '../lib/auth-cookies';

const MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

describe('authCookieOptions', () => {
  it('shortens the 400 days Supabase asks for', () => {
    expect(authCookieOptions({ path: '/', sameSite: 'lax', maxAge: 400 * 24 * 60 * 60 }, true)).toEqual({
      path: '/',
      sameSite: 'lax',
      secure: true,
      maxAge: MAX_AGE,
    });
  });

  it('keeps maxAge 0, which deletes the cookie on sign out', () => {
    expect(authCookieOptions({ maxAge: 0 }, true).maxAge).toBe(0);
  });

  it('forces SameSite=Lax and leaves Secure off over plain http', () => {
    const options = authCookieOptions({ sameSite: 'none' }, false);
    expect(options).toMatchObject({ sameSite: 'lax', secure: false, maxAge: MAX_AGE, path: '/' });
  });
});

describe('browser session cookie', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('writes the capped duration and Secure over https, and reads the value back decoded', () => {
    const written: string[] = [];
    vi.stubGlobal('window', { location: { protocol: 'https:' } });
    vi.stubGlobal('document', {
      set cookie(line: string) { written.push(line); },
      get cookie() { return 'theme=x; sb-abc-auth-token=base64-eyJh%3D%3D'; },
    });

    writeBrowserCookie('sb-abc-auth-token', 'base64-eyJh==', { path: '/', sameSite: 'lax', maxAge: 400 * 24 * 60 * 60 });
    expect(written).toEqual([`sb-abc-auth-token=base64-eyJh%3D%3D; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax; Secure`]);
    expect(readBrowserCookies()).toContainEqual({ name: 'sb-abc-auth-token', value: 'base64-eyJh==' });
  });

  it('returns no cookie during server rendering', () => {
    expect(readBrowserCookies()).toEqual([]);
  });
});
