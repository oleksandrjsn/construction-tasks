import { v4 as uuidv4 } from "uuid";
import type { UserRepository } from "./repository";
import type { UserResponse } from "../model";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async login(name: string): Promise<UserResponse> {
    return globalErrorHandler.wrapAsync(async () => {
      if (!name?.trim()) {
        throw new Error("Username is required");
      }

      const normalizedName = name.trim();
      let user = await this.userRepository.findByName(normalizedName);

      if (!user) {
        user = await this.userRepository.create({
          name: normalizedName,
          id: uuidv4(),
        });
      }

      return {
        id: user.id,
        name: user.name,
      };
    });
  }
}
