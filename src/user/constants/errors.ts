import { HttpException, HttpStatus } from '@nestjs/common';

export const TypeOrmErrors = {
  duplicateKeyConstraint: 'duplicate key value violates unique constraint',
};

export class DuplicateEmailError extends Error {
  constructor() {
    super('a user already exists with this email');
    this.name = 'DuplicateEmailError';
  }

  errorResponse = new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      error: this.message,
    },
    HttpStatus.BAD_REQUEST,
  );
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`a user could not be found for id ${id}`);
    this.name = 'UserNotFoundError';
  }

  errorResponse = new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      error: this.message,
    },
    HttpStatus.BAD_REQUEST,
  );
}
