import { CreateEventDto } from '../dto/create-event.dto';
import { EventEntity } from '../entities/event.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/entities/user.entity';

export const mockCreateEvent: {
  dto: CreateEventDto;
  eventEntity: (user: User) => EventEntity;
} = {
  dto: {
    user: {
      id: '1234',
    },
    consents: [
      {
        id: 'sms_notifications',
        enabled: true,
      },
    ],
  },
  eventEntity: (user: User) => {
    const mockEvent = new EventEntity();
    mockEvent.id = uuidv4();
    mockEvent.user = user;
    mockEvent.sms_notifications = true;
    mockEvent.email_notifications = undefined;
    return mockEvent;
  },
};
