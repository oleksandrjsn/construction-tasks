import { v4 as uuid } from "uuid";
import { UnauthenticatedError } from "../../../shared/lib/errors/UnauthenticatedError";
import type { UserRepository } from "./repository";
import type { UserSessionAPI } from "./session";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

export class UserService {
  private userRepository: UserRepository;
  private sessionService: UserSessionAPI;

  constructor(userRepository: UserRepository, sessionService: UserSessionAPI) {
    this.userRepository = userRepository;
    this.sessionService = sessionService;
  }

  getProfile = async () => {
    try {
      const userInSession = await this.sessionService.getSession();

      if (!userInSession) {
        return null;
      }

      const user = await this.userRepository.findByName(userInSession.name);

      if (!user) {
        this.logout();
        throw new UnauthenticatedError("User not found, please log in again.");
      }

      return user;
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  login = async (name: string) => {
    try {
      let user = await this.userRepository.findByName(name);

      if (!user) {
        user = await this.userRepository.create({
          name,
          id: uuid(),
          updatedAt: Date.now(),
          createdAt: Date.now(),
        });
      }

      await this.sessionService.setSession({
        id: user.id,
        name: user.name,
      });

      return {
        id: user.id,
        name: user.name,
      };
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };

  logout = async () => {
    try {
      await this.sessionService.clearSession();
    } catch (error) {
      globalErrorHandler.handleError(error);
    }
  };
}
