import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'didomi',
      entities: [],
      synchronize: !!process.env.PRODUCTION,
    }),
    V1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
