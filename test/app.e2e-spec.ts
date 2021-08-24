import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { internet as fakerInternet } from 'faker';
import { AppModule } from './../src/app.module';
import { messages } from '../src/user/constants/messages';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { IUserResponse } from '../src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockUserRepository } from '../src/user/mocks/user-repository';
import { v4 as uuidv4 } from 'uuid';
import {
  DuplicateEmailError,
  InvalidEmailError,
} from '../src/user/constants/errors';

describe('App (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  const userEmail = fakerInternet.email();
  let createdUser: IUserResponse;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: 'e2e-connection',
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'root',
          password: 'root',
          database: 'didomi',
          autoLoadEntities: true,
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    moduleRef.close();
  });

  it('/v1/user (POST) (200)', () => {
    mockUserRepository.save.mockReturnValueOnce({
      active: true,
      id: uuidv4,
      email: userEmail,
      events: null,
    });

    return request(app.getHttpServer())
      .post('/v1/user')
      .send({ email: userEmail })
      .expect(201)
      .then((result) => {
        const body: IUserResponse = result.body;
        createdUser = body;

        expect(isUUID(body.id)).toBe(true);
        expect(body.email).toBe(userEmail);
        expect(Array.isArray(body.consents)).toBe(true);
        expect(body.consents).toHaveLength(0);
      });
  });

  it('/v1/user (POST) (400 / Duplicate email)', () => {
    return request(app.getHttpServer())
      .post('/v1/user')
      .send({ email: userEmail })
      .expect(422)
      .expect({ status: 422, error: messages.duplicateEmailError });
  });

  it('/v1/user (POST) (400 / Invalid email)', () => {
    return request(app.getHttpServer())
      .post('/v1/user')
      .send({ email: userEmail })
      .expect(422)
      .expect({ status: 422, error: messages.duplicateEmailError });
  });

  it('/v1/user (GET) (200)', function () {
    return request(app.getHttpServer())
      .get(`/v1/user/${createdUser.id}`)
      .expect(200)
      .expect(createdUser);
  });

  it('/v1/user (GET) (400 / UserNotFound)', function () {
    const wrongId = uuidv4();
    return request(app.getHttpServer())
      .get(`/v1/user/${wrongId}`)
      .expect(400)
      .expect({ status: 400, error: messages.idNotFound(wrongId) });
  });

  it('/v1/user (DELETE) (200)', function () {
    return request(app.getHttpServer())
      .delete(`/v1/user/${createdUser.id}`)
      .expect(200)
      .expect({ message: messages.userDeleted });
  });

  it('/v1/user (DELETE) (400 / UserNotDeleted)', function () {
    return request(app.getHttpServer())
      .delete(`/v1/user/${createdUser.id}`)
      .expect(400)
      .expect({ error: messages.userNotDeleted(createdUser.id), status: 400 });
  });
});
