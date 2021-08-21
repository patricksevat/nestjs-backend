import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EventsToConsentInterceptor } from './interceptors/events-to-consent.interceptor';
import { IUserResponse } from './entities/user.entity';
import { messages } from './constants/messages';
import { UserExceptionFilter } from './exception-filters/user-exception-filters';

@UseFilters(UserExceptionFilter)
@UseInterceptors(EventsToConsentInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserResponse | HttpException> {
    return await this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return {
      message: messages.userDeleted,
    };
  }
}
