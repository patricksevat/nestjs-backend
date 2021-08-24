import { HttpStatus } from '@nestjs/common';
import { messages } from './messages';

export const TypeOrmErrors = {
  duplicateKeyConstraint: 'duplicate key value violates unique constraint',
};

export class UserServiceError extends Error {
  constructor(message) {
    super(message);
  }

  errorResponse: { status: number; error: string };
}

export class DuplicateEmailError extends UserServiceError {
  constructor() {
    super(messages.duplicateEmailError);
    this.name = 'DuplicateEmailError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}

export class InvalidEmailError extends UserServiceError {
  constructor() {
    super(messages.invalidEmailError);
    this.name = 'InvalidEmailError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}

export class UserNotFoundError extends UserServiceError {
  constructor(id: string) {
    super(messages.idNotFound(id));
    this.name = 'UserNotFoundError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}

export class UserNotDeletedError extends UserServiceError {
  constructor(id: string) {
    super(messages.userNotDeleted(id));
    this.name = 'UserNotDeletedError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}
