import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './v1/v1.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'didomi',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RouterModule.register([
      {
        path: 'v1',
        module: V1Module,
      },
    ]),
    V1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
