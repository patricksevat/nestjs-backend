import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { UserService } from '../user/user.service';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>,
    private userService: UserService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const [user, activeEvent] = await this.getUserAndActiveEvent(
      createEventDto.user.id,
    );

    const newEvent = this.createNewEvent(user, activeEvent, createEventDto);
    return this.saveEntities(newEvent, activeEvent);
  }

  private async getUserAndActiveEvent(
    userId: string,
  ): Promise<[User, EventEntity]> {
    const userPromise = this.userService.findOne(userId);
    const activeEventPromise = this.eventsRepository.findOne({
      userId,
      active: true,
    });
    return Promise.all([userPromise, activeEventPromise]);
  }

  private createNewEvent(
    user: User,
    activeEvent: EventEntity,
    createEventDto: CreateEventDto,
  ): EventEntity {
    const newEvent = new EventEntity();
    newEvent.user = user;
    newEvent.email_notifications = activeEvent?.email_notifications;
    newEvent.sms_notifications = activeEvent?.sms_notifications;

    createEventDto.consents.forEach((consent) => {
      newEvent[consent.id] = consent.enabled;
    });

    return newEvent;
  }

  private saveEntities(newEvent: EventEntity, activeEvent: EventEntity) {
    const entitiesToSave: DeepPartial<EventEntity>[] = [newEvent];
    if (activeEvent) {
      entitiesToSave.push({
        id: activeEvent.id,
        active: false,
      });
    }

    return this.eventsRepository.save(entitiesToSave);
  }
}
