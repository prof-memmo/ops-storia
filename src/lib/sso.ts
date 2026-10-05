export interface SsoUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  avatar?: string;
  subscription?: string;
  photoURL?: string;
}

export function getSsoUser(): SsoUser | null {
  if (typeof window === "undefined") return null;

  try {
    if (window.location.hash && window.location.hash.includes("pm_sso=")) {
      const match = window.location.hash.match(/pm_sso=([^&]+)/);
      if (match && match[1]) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed && parsed.uid) {
          const ssoUser: SsoUser = {
            uid: parsed.uid,
            email: parsed.email || "",
            displayName: parsed.name || (parsed.email ? parsed.email.split("@")[0] : "Docente"),
            role: parsed.role || "docente",
            avatar: parsed.avatar || "",
            subscription: parsed.subscription || "base",
            photoURL: parsed.avatar || ""
          };
          localStorage.setItem("pm_sso_ops", JSON.stringify(ssoUser));
          history.replaceState(null, "", window.location.pathname + window.location.search);
          return ssoUser;
        }
      }
    }
  } catch (e) {
    console.warn("Errore parsing SSO ops-web:", e);
  }

  try {
    const cached = localStorage.getItem("pm_sso_ops");
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {}

  return null;
}

export function clearSsoUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("pm_sso_ops");
  }
}
