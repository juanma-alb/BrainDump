import { User } from '@domain/entities/User';
import type { IUserRepository } from '@domain/ports/IUserRepository';
import { UserModel } from './models/UserModel';

export class MongoDbUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await UserModel.findOneAndUpdate(
      { id: user.id },
      {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
      },
      { upsert: true, new: true }
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;

    return User.create({
      id: doc.id,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      createdAt: doc.createdAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ id });
    if (!doc) return null;

    return User.create({
      id: doc.id,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      createdAt: doc.createdAt,
    });
  }
}
