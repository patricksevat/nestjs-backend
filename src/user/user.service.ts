import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // TODO catch duplicate email
    const user = new User();
    Object.assign(user, createUserDto);
    return this.userRepository.save(user);
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      id,
      active: true,
    });
  }

  remove(id: string) {
    return this.userRepository.update({ id, active: true }, { active: false });
  }
}
