import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { mockUserRepository } from '../user/mocks/user-repository';
import { EventEntity } from './entities/event.entity';
import { mockEventRepository } from './mocks/event-entity-repository';
import { mockCreateEvent } from './mocks/event';
import { mockUserWithoutEvents } from '../user/mocks/user';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    jest.resetAllMocks();
    mockUserRepository.findOne.mockReturnValue({
      ...mockUserWithoutEvents,
      events: [],
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        EventService,
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

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', function () {
    it('should create an event', async function () {
      // await service.create(mockCreateEvent.dto);
      // expect(mockEventRepository.save).toHaveBeenCalledTimes(1);
      // expect(mockEventRepository.save).toHaveBeenCalledWith(
      //   mockCreateEvent.eventEntity,
      // );
    });

    it('should deactivate the existing active event for the user', function () {});

    it('should handle error when user cannot be found', function () {});
  });
});
