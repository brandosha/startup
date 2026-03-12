import { useEffect, useState } from "react";
import { StateManager } from "./StateManager";

export class AuthManager extends StateManager {

  private curSession: string | null = null;
  private curUser: { username: string } | null = null;

  constructor() {
    super();

    this.curSession = localStorage.getItem("startup_curSession");
  }

  async register(username: string, password: string) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await res.json();
    this.curUser = data.user;
    this.curSession = data.authToken;
    this.dispatchChange();
  }

  async login(username: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await res.json();
    this.curUser = data.user;
    this.curSession = data.authToken;
    this.dispatchChange();
  }

  async logout() {
    const res = await fetch("/api/auth/logout", {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Logout failed");
    }

    this.curUser = null;
    this.dispatchChange();
  }

  currentUser(): { username: string } | null {
    if (this.curSession && this.curUser === null) {
      this.fetchCurrentUser();
    }
    return this.curUser;
  }

  async fetchCurrentUser() {
    if (!this.curSession) {
      return null
    }

    const res = await fetch("/api/auth/me", {
      headers: { "Authorization": this.curSession },
    });

    if (res.status === 401) {
      this.curSession = null;
      this.curUser = null;
      this.dispatchChange();
      return null;
    } else if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch current user");
    }

    const user = await res.json();
    this.curUser = user;
    this.dispatchChange();

    return this.curUser;
  }


  dispatchChange(): void {
    super.dispatchChange();

    if (this.curSession) {
      localStorage.setItem("startup_curSession", this.curSession);
    } else {
      localStorage.removeItem("startup_curSession");
    }
  }
}

export const auth = new AuthManager();

export function useAuth() {
  const [_, setVersion] = useState(0);
  useEffect(() => auth.changeEffect(setVersion), []);
  return auth;
}