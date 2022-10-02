import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { User } from './user';
import { UserRepository } from './user.repository';
import { v4 as UUIDv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getUserByTelegramId(telegramId: string) {
    const user = await this.userRepository.findOneByTelegramId(telegramId);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
  
  async createUserByTelegram(
    telegramId: string,
    username: string,
    language: string,
  ) {
    const user = new User({
      id: UUIDv4(),
      telegramId,
      username,
      language,
      createdAt: new Date(),
      updatedAt: null,
    });
    await this.userRepository.save(user);
    return user;
  }
}
