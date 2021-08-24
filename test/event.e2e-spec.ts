import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IUserResponse } from '../src/user/entities/user.entity';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { internet as fakerInternet } from 'faker';

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

  it('/v1/event (POST) 200', function () {
    return request(app.getHttpServer())
      .post('/v1/event')
      .send({
        user: {
          id: userId,
        },
        consents: [
          {
            id: 'sms_notifications',
            enabled: false,
          },
        ],
      })
      .expect(201)
      .then((result) => {
        const body: IUserResponse = result.body;

        expect(isUUID(body.id)).toBe(true);
        expect(body.email).toBe(userEmail);
        expect(Array.isArray(body.consents)).toBe(true);
        expect(body.consents).toHaveLength(0);
      });
  });
});
