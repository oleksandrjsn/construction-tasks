import { useDb } from "../../../app/providers/database-provider";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";
import { UserRepository } from "../api/repository";
import { UserSessionAPI } from "../api/session";
import type { UserResponse } from "./types";
import { v4 as uuidv4 } from "uuid";

export const useAuth = () => {
  const { db } = useDb();
  const userRepository = db ? new UserRepository(db) : null;

  const login = async (name: string): Promise<UserResponse> => {
    return globalErrorHandler.wrapAsync(async () => {
      if (!userRepository) {
        throw new Error("Database is not ready");
      }

      if (!name?.trim()) {
        throw new Error("Username is required");
      }

      const normalizedName = name.trim();

      let user = await userRepository.findByName(normalizedName);

      if (!user) {
        user = await userRepository.create({
          name: normalizedName,
          id: uuidv4(),
          updatedAt: Date.now(),
        });
      }

      return {
        id: user.id,
        name: user.name,
      };
    });
  };

  const getProfile = () => {
    return globalErrorHandler.wrapSync(() => {
      return UserSessionAPI.getSession();
    });
  };

  return { getProfile, login };
};
