import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { V1Controller } from './v1.controller';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    EventModule,
    RouterModule.register([
      {
        path: 'v1',
        module: UserModule,
      },
      {
        path: 'v1',
        module: EventModule,
      },
    ]),
  ],
  controllers: [V1Controller],
})
export class V1Module {}
