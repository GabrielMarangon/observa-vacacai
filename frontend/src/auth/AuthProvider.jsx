import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, createAuthHeaders } from "../lib/api";

const AuthContext = createContext(null);
const storageKey = "observa_vacacai_admin_token";

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    ready: false,
    token: "",
    user: null,
  });

  useEffect(() => {
    const storedToken = window.localStorage.getItem(storageKey);

    if (!storedToken) {
      setState({
        ready: true,
        token: "",
        user: null,
      });
      return;
    }

    let active = true;

    async function restoreSession() {
      try {
        const payload = await apiFetch("/api/auth/me", {
          headers: createAuthHeaders(storedToken),
        });

        if (!active) {
          return;
        }

        setState({
          ready: true,
          token: storedToken,
          user: payload.user,
        });
      } catch (_error) {
        window.localStorage.removeItem(storageKey);

        if (!active) {
          return;
        }

        setState({
          ready: true,
          token: "",
          user: null,
        });
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(credentials) {
    const payload = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    window.localStorage.setItem(storageKey, payload.token);
    setState({
      ready: true,
      token: payload.token,
      user: payload.user,
    });

    return payload.user;
  }

  function logout() {
    window.localStorage.removeItem(storageKey);
    setState({
      ready: true,
      token: "",
      user: null,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: Boolean(state.token && state.user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
