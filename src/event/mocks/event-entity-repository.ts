import { v4 as uuidv4 } from 'uuid';
import { EventEntity } from '../entities/event.entity';

export const mockEventRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
  save: jest.fn((events: EventEntity[], id = uuidv4()) => {
    return [
      {
        ...events[0],
        id: id,
      },
    ];
  }),
};
