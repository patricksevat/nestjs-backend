import { HttpStatus } from '@nestjs/common';

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
    super('a user already exists with this email');
    this.name = 'DuplicateEmailError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}

export class UserNotFoundError extends UserServiceError {
  constructor(id: string) {
    super(`a user could not be found for id ${id}`);
    this.name = 'UserNotFoundError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}

export class UserNotDeletedError extends UserServiceError {
  constructor(id: string) {
    super(`user ${id} could not be deleted`);
    this.name = 'UserNotDeletedError';
  }

  errorResponse = {
    status: HttpStatus.BAD_REQUEST,
    error: this.message,
  };
}
