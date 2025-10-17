import type { UserResponse } from "../model/types";

/**
 * Simulates user session management using sessionStorage.
 */
export class UserSessionAPI {
  private static sessionKey = "userSession";

  static async getSession() {
    const userToken = sessionStorage.getItem(UserSessionAPI.sessionKey);
    if (!userToken) {
      return null;
    }

    const user: UserResponse = JSON.parse(userToken);
    return user;
  }

  static async setSession(user: UserResponse) {
    const token = JSON.stringify(user);
    sessionStorage.setItem(UserSessionAPI.sessionKey, token);
  }
}
