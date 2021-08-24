import { HttpStatus } from '@nestjs/common';
import { messages } from './messages';

export const TypeOrmErrors = {
  foreignKeyConstraint: 'violates foreign key constraint',
};

export class EventServiceError extends Error {
  constructor(message) {
    super(message);
  }

  errorResponse: { status: number; error: string };
}

export class UserIdNotFoundError extends EventServiceError {
  constructor() {
    super(messages.userIdNotFound);
    this.name = 'UserIdNotFoundError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}
