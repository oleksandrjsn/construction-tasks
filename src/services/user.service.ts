import { getDb } from "../db";
import type { UserResponse } from "./types";

export class UserService {
  static async findOrCreateUser(name: string): Promise<UserResponse> {
    const db = await getDb();
    let user = await db.users.findOne({ selector: { name } }).exec();
    if (!user) {
      user = await db.users.insert({ name });
    }
    const userJson = user.toJSON();

    return {
      id: userJson.id!,
      name: userJson.name,
    };
  }
}
