import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { internet as fakerInternet } from 'faker';
import { IEventCreationResponse } from '../src/event/entities/event.entity';
import { v4 as uuidv4 } from 'uuid';
import { messages } from '../src/event/constants/messages';

describe('Event (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let userId: string;

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

  it('should first create a user so we can test', function () {
    return request(app.getHttpServer())
      .post('/v1/user')
      .send({ email: fakerInternet.email() })
      .expect(201)
      .then((result) => {
        userId = result.body.id;
      });
  });

  it('/v1/event (POST) 201', function () {
    return request(app.getHttpServer())
      .post('/v1/event')
      .send({
        user: {
          id: userId,
        },
        consents: [
          {
            id: 'sms_notifications',
            enabled: true,
          },
        ],
      })
      .expect(201)
      .then((result) => {
        const body: IEventCreationResponse = result.body;

        expect(isUUID(body.id)).toBe(true);
        expect(isUUID(body.userId)).toBe(true);
        expect(body.sms_notifications).toBe(true);
        expect(body.email_notifications).toBe(false);
      });
  });

  it('/v1/event (POST) 201 (merge with previous consents)', function () {
    return request(app.getHttpServer())
      .post('/v1/event')
      .send({
        user: {
          id: userId,
        },
        consents: [
          {
            id: 'email_notifications',
            enabled: true,
          },
        ],
      })
      .expect(201)
      .then((result) => {
        const body: IEventCreationResponse = result.body;

        expect(isUUID(body.id)).toBe(true);
        expect(isUUID(body.userId)).toBe(true);
        expect(body.sms_notifications).toBe(true);
        expect(body.email_notifications).toBe(true);
      });
  });

  it('/v1/event (POST) 400 (UserIdNotFoundError)', function () {
    return request(app.getHttpServer())
      .post('/v1/event')
      .send({
        user: {
          id: uuidv4(),
        },
        consents: [
          {
            id: 'sms_notifications',
            enabled: true,
          },
        ],
      })
      .expect(400)
      .expect({ error: messages.userIdNotFound, status: 400 });
  });

  it('/v1/event (GET) 200', function () {
    return request(app.getHttpServer())
      .get('/v1/event')
      .set('role', 'admin')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(1);
      });
  });

  it('/v1/event (GET) 403', function () {
    return request(app.getHttpServer()).get('/v1/event').expect(403);
  });
});
