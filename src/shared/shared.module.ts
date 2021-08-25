import { Module } from '@nestjs/common';
import { RolesGuard } from './authorization/roles.guard';

@Module({
  providers: [RolesGuard],
})
export class SharedModule {}
