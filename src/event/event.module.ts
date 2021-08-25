import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { SharedModule } from '../shared/shared.module';
import { RolesGuard } from '../shared/authorization/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, User]), SharedModule],
  controllers: [EventController],
  providers: [EventService, UserService, RolesGuard],
})
export class EventModule {}
