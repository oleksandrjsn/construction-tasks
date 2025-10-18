import { UserService } from ".";
import type { DatabaseType } from "../../../shared/lib/database";
import { UserRepository } from "./repository";
import { UserSessionAPI } from "./session";

export function createUserService(db: DatabaseType): UserService {
  const userRepository = new UserRepository(db);
  const userSessionAPI = new UserSessionAPI();

  const service = new UserService(userRepository, userSessionAPI);

  return service;
}
