import type { DatabaseType } from "../../../shared/lib/database";
import type { UserDocType } from "../../../shared/lib/database/schemas";

export class UserRepository {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  async findByName(name: string): Promise<UserDocType | null> {
    const user = await this.db.users.findOne({ selector: { name } }).exec();
    return user ? user.toJSON() : null;
  }

  async create(userData: UserDocType): Promise<UserDocType> {
    const newUser = await this.db.users.insert(userData);
    return newUser.toJSON();
  }
}
