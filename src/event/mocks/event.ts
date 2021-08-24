import { CreateEventDto } from '../dto/create-event.dto';
import { EventEntity } from '../entities/event.entity';
import { v4 as uuidv4 } from 'uuid';

export const mockCreateEvent: {
  dto: CreateEventDto;
  eventEntity: () => EventEntity;
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
  eventEntity: () => {
    const mockEvent = new EventEntity();
    mockEvent.id = uuidv4();
    mockEvent.userId = '1234';
    mockEvent.sms_notifications = true;
    mockEvent.email_notifications = undefined;
    return mockEvent;
  },
};
