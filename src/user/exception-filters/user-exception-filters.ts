import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { UserServiceError } from '../constants/errors';

@Catch(UserServiceError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: UserServiceError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(exception.errorResponse.status)
      .json(exception.errorResponse);
  }
}
