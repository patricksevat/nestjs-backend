import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EventsToConsentInterceptor } from './interceptors/events-to-consent.interceptor';
import { IUserResponse } from './entities/user.entity';
import { messages } from './constants/messages';
import { DuplicateEmailError, UserNotFoundError } from './constants/errors';

@UseInterceptors(EventsToConsentInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserResponse | HttpException> {
    try {
      return await this.userService.create(createUserDto);
    } catch (e) {
      if (e instanceof DuplicateEmailError) {
        throw e.errorResponse;
      }
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw e.errorResponse;
      }
      throw e;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { affected } = await this.userService.remove(id);
    return {
      message: affected > 0 ? messages.userDeleted : messages.userNotDeleted,
    };
  }
}
