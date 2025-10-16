import { getDb } from "../db";
import type { UserResponse } from "./types";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  static async findOrCreateUser(name: string): Promise<UserResponse> {
    const db = await getDb();
    let user = await db.users.findOne({ selector: { name } }).exec();
    if (!user) {
      console.log("Created new user:", name);
      user = await db.users.insert({ name, id: uuidv4() });
    }
    const userJson = user.toJSON();

    return {
      id: userJson.id!,
      name: userJson.name,
    };
  }
}
