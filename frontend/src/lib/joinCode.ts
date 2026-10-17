/** The invite or referral code from a /join link, kept until the application is sent. */
const KEY = 'wgv_join_code';

export function saveJoinCode(code: string) {
  try {
    localStorage.setItem(KEY, code);
  } catch {
    // Storage blocked: the member can still join, just without the link's benefits
  }
}

export function readJoinCode(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearJoinCode() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
