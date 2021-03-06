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
import { UserServiceMock } from '../user/mocks/user-service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        EventService,
        {
          provide: UserService,
          useValue: UserServiceMock,
        },
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
      const eventEntityToCreate = mockCreateEvent.eventEntity();
      delete eventEntityToCreate.id;

      await service.create(mockCreateEvent.dto);
      expect(mockEventRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventRepository.save).toHaveBeenCalledWith([
        eventEntityToCreate,
      ]);
    });

    it('should deactivate the existing active event for the user', async function () {
      mockEventRepository.findOne.mockReturnValue({ id: '123' });
      await service.create(mockCreateEvent.dto);
      expect(mockEventRepository.save).toHaveBeenCalledTimes(1);

      const firstCall = mockEventRepository.save.mock.calls[0];
      const firstArgumentIsAnArray = firstCall[0];
      expect(firstArgumentIsAnArray[1]).toMatchObject({
        id: '123',
        active: false,
      });
    });

    it('should apply the new consents to the existing consents', async function () {
      mockEventRepository.findOne.mockReturnValue({
        sms_notifications: false,
        email_notifications: true,
      });
      await service.create(mockCreateEvent.dto);
      const firstCall = mockEventRepository.save.mock.calls[0];
      const firstArgumentIsAnArray = firstCall[0];
      const createdEvent: EventEntity = firstArgumentIsAnArray[0];

      expect(createdEvent.email_notifications).toBe(true);
      expect(createdEvent.sms_notifications).toBe(true);
    });
  });
});
