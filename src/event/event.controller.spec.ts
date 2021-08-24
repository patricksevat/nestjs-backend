import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { mockUserRepository } from '../user/mocks/user-repository';
import { EventEntity } from './entities/event.entity';
import { EventServiceMock } from './mocks/event-service';
import { mockEventRepository } from './mocks/event-entity-repository';
import { mockCreateEvent } from './mocks/event';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        EventService,
        {
          provide: EventService,
          useValue: EventServiceMock,
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(EventEntity),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an event', async function () {
    await controller.createEvent(mockCreateEvent.dto);
    expect(EventServiceMock.create).toHaveBeenCalledTimes(1);
    expect(EventServiceMock.create).toHaveBeenCalledWith(mockCreateEvent.dto);
  });
});
