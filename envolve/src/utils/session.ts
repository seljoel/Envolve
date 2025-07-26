// utils/session.ts
const SESSION_KEY = "user_session";
const SESSION_DURATION_MS = 1000 * 60 * 30; // 30 minutes

export function setSession(email: string) {
  const session = {
    email,
    createdAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): { email: string; createdAt: number } | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    if (Date.now() - session.createdAt < SESSION_DURATION_MS) return session;
    clearSession();
    return null;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
