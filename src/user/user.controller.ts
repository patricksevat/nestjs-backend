import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EventsToConsentInterceptor } from './interceptors/events-to-consent.interceptor';
import { IUserResponse } from './entities/user.entity';
import { messages } from './constants/messages';

@UseInterceptors(EventsToConsentInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO
  // Think about the responsibilities between controller and service
  // What should each do?
  // Business logic should reside in service, as do db calls
  // We could make the controller then respond to switch statements or async await try catch blocks
  // Thinking about try catch blocks, we could utilize https://docs.nestjs.com/exception-filters
  // case success => return result
  // case
  // TODO

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return (
      user || {
        message: messages.idNotFound(id),
      }
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { affected } = await this.userService.remove(id);
    return {
      message: affected > 0 ? messages.userDeleted : messages.userNotDeleted,
    };
  }
}
