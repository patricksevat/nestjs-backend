import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { EventServiceError } from '../constants/errors';

@Catch(EventServiceError)
export class EventExceptionFilter implements ExceptionFilter {
  catch(exception: EventServiceError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(exception.errorResponse.status)
      .json(exception.errorResponse);
  }
}
