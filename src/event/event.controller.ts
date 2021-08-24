import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { StripActiveInterceptor } from './interceptors/strip-active.interceptor';
import { EventExceptionFilter } from './exception-filters/user-exception-filters';

@UseFilters(EventExceptionFilter)
@UseInterceptors(StripActiveInterceptor)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }
}
