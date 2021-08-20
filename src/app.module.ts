import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';

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
    UserModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
