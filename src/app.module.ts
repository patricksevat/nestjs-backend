import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
