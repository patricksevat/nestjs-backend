import { v4 as uuidv4 } from 'uuid';
import { EventEntity } from '../entities/event.entity';

export const mockEventRepository = {
  findOne: jest.fn(),
  update: jest.fn(),
  save: jest.fn((event: EventEntity, id = uuidv4()) => {
    return {
      ...event,
      id: id,
    };
  }),
};
