import { useEffect, useState } from "react";
import { StateManager } from "./StateManager";

export class AuthManager extends StateManager {
  private users: { [username: string]: { password: string } } = {};
  private sessions: { [token: string]: { username: string } } = {};
  private curSession: string | null = null;

  private curUser: { username: string } | null = null;

  constructor() {
    super();

    const storedUsers = localStorage.getItem("startup_users");
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }

    const storedSessions = localStorage.getItem("startup_sessions");
    if (storedSessions) {
      this.sessions = JSON.parse(storedSessions);
    }

    const storedCurSession = localStorage.getItem("startup_curSession");
    this.curSession = storedCurSession;
  }

  async register(username: string, password: string) {
    if (this.users[username]) {
      throw new Error("Username already exists");
    }

    this.users[username] = { password };
    this.dispatchChange();
  }

  async login(username: string, password: string) {
    const user = this.users[username];
    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== password) {
      throw new Error("Incorrect password");
    }

    const token = crypto.randomUUID();
    this.sessions[token] = { username };
    this.curSession = token;
    this.curUser = { username };
    this.dispatchChange();
  }

  async logout() {
    if (!this.curSession) return;

    delete this.sessions[this.curSession];
    this.curSession = null;
    this.curUser = null;
    this.dispatchChange();
  }

  currentUser(): { username: string } | null {
    if (this.curUser == null) {
      this.fetchCurrentUser();
    }
    return this.curUser;
  }

  async fetchCurrentUser() {
    if (!this.curSession) return null;

    const session = this.sessions[this.curSession];
    if (!session) return null;

    const user = this.users[session.username];
    if (!user) return null;

    await new Promise(resolve => setTimeout(resolve, 500)); // simulate network delay

    this.curUser = { username: session.username };
    this.dispatchChange();

    return this.curUser;
  }


  dispatchChange(): void {
    super.dispatchChange();
    // localStorage.setItem("startup_users", JSON.stringify(this.users));
    // localStorage.setItem("startup_sessions", JSON.stringify(this.sessions));

    // if (this.curSession) {
    //   localStorage.setItem("startup_curSession", this.curSession);
    // } else {
    //   localStorage.removeItem("startup_curSession");
    // }
  }
}

export const auth = new AuthManager();

export function useAuth() {
  const [_, setVersion] = useState(0);
  useEffect(() => auth.changeEffect(setVersion), []);
  return auth;
}