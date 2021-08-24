import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>,
    private userService: UserService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    await this.deactivateEvent(createEventDto.user.id);
    return this.createEvent(createEventDto);
  }

  private async createEvent(createEventDto: CreateEventDto) {
    const newEvent = new EventEntity();
    newEvent.user = await this.userService.findOne(createEventDto.user.id);

    createEventDto.consents.forEach((consent) => {
      newEvent[consent.id] = consent.enabled;
    });
    return this.eventsRepository.save(newEvent);
  }

  private deactivateEvent(userId) {
    return this.eventsRepository.update(
      { user: userId, active: true },
      { active: false },
    );
  }
}
