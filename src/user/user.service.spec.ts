import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { mockUserRepository } from './mocks/user-repository';
import { CreateUserDto } from './dto/create-user.dto';
import {
  DuplicateEmailError,
  TypeOrmErrors,
  UserNotDeletedError,
  UserNotFoundError,
} from './constants/errors';
import { mockUserWithoutEvents } from './mocks/user';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', function () {
    const userRequestBody: CreateUserDto = {
      email: 'name@provider.com',
    };

    it('should create a user', async function () {
      await service.create(userRequestBody);
      const createArg = mockUserRepository.save.mock.calls[0][0];

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(createArg).toMatchObject(userRequestBody);
    });

    it('should catch a duplicate email and return a DuplicateEmailError', async function () {
      expect.assertions(1);
      mockUserRepository.save.mockRejectedValueOnce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new Error(TypeOrmErrors.duplicateKeyConstraint),
      );

      try {
        await service.create(userRequestBody);
      } catch (e) {
        expect(e instanceof DuplicateEmailError).toBe(true);
      }
    });
  });

  describe('queryBuilder()', function () {
    it('should find a user by id && active === true', async function () {
      const { getOneMock, whereMock } = mockUserRepository;
      getOneMock.mockReturnValue(mockUserWithoutEvents);

      await service.findOne(mockUserWithoutEvents.id);

      expect(getOneMock).toHaveBeenCalledTimes(1);
      expect(whereMock).toHaveBeenCalledWith({
        id: mockUserWithoutEvents.id,
        active: true,
      });
    });

    it('should throw a UserNotFoundError in case the user cannot be found', async function () {
      const { getOne: getOneMock } = mockUserRepository
        .createQueryBuilder()
        .leftJoinAndSelect()
        .where();
      getOneMock.mockReturnValueOnce(null);
      expect.assertions(1);

      try {
        await service.findOne('id_does_not_exist');
      } catch (e) {
        expect(e instanceof UserNotFoundError).toBe(true);
      }
    });
  });

  describe('remove()', function () {
    it('should soft delete the user by setting active to false', async function () {
      mockUserRepository.update.mockReturnValueOnce({ affected: 1 });
      const result = await service.remove(mockUserWithoutEvents.id);

      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        { id: mockUserWithoutEvents.id, active: true },
        { active: false },
      );
      expect(result).toBe(true);
    });

    it('should throw a UserNotDeletedError when soft delete fails', async function () {
      mockUserRepository.update.mockReturnValueOnce({ affected: 0 });
      expect.assertions(3);

      try {
        await service.remove(mockUserWithoutEvents.id);
      } catch (e) {
        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalledWith(
          { id: mockUserWithoutEvents.id, active: true },
          { active: false },
        );
        expect(e instanceof UserNotDeletedError).toBe(true);
      }
    });
  });
});
