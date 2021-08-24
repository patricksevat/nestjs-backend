import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TypeOrmErrors, UserIdNotFoundError } from './constants/errors';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const activeEvent = await this.eventsRepository.findOne({
        userId: createEventDto.user.id,
        active: true,
      });

      const newEvent = this.createNewEvent(activeEvent, createEventDto);
      const [savedNewEvent] = await this.saveEntities(newEvent, activeEvent);
      return savedNewEvent;
    } catch (e) {
      if (e?.message?.includes(TypeOrmErrors.foreignKeyConstraint)) {
        throw new UserIdNotFoundError();
      }
      throw e;
    }
  }

  private createNewEvent(
    activeEvent: EventEntity,
    createEventDto: CreateEventDto,
  ): EventEntity {
    const newEvent = new EventEntity();
    newEvent.userId = createEventDto.user.id;
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
