import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  DuplicateEmailError,
  TypeOrmErrors,
  UserNotDeletedError,
  UserNotFoundError,
} from './constants/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | any> {
    try {
      const user = new User();
      Object.assign(user, createUserDto);
      return await this.userRepository.save(user);
    } catch (e) {
      if (e?.message?.includes(TypeOrmErrors.duplicateKeyConstraint)) {
        throw new DuplicateEmailError();
      }
      throw e;
    }
  }

  async findOne(id: string) {
    const foundUser = await this.userRepository.findOne({
      id,
      active: true,
    });

    if (!foundUser) {
      throw new UserNotFoundError(id);
    }

    return foundUser;
  }

  async remove(id: string) {
    const { affected } = await this.userRepository.update(
      { id, active: true },
      { active: false },
    );
    if (affected > 0) {
      return true;
    }

    throw new UserNotDeletedError(id);
  }
}
