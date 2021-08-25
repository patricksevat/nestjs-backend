import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { StripActiveInterceptor } from './interceptors/strip-active.interceptor';
import { EventExceptionFilter } from './exception-filters/user-exception-filters';
import { RoleEnum } from '../shared/authorization/roles.enum';
import { Roles } from '../shared/authorization/roles.decorator';
import { RolesGuard } from '../shared/authorization/roles.guard';

@UseFilters(EventExceptionFilter)
@UseInterceptors(StripActiveInterceptor)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.admin)
  async getAllEvents() {
    return 'isAdmin';
  }

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }
}
