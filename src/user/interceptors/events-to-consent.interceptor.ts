import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserResponse, User } from '../entities/user.entity';

@Injectable()
export class EventsToConsentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (value instanceof User) {
          if (!value.events) {
            return {
              id: value.id,
              email: value.email,
              consents: [],
            };
          }
        }

        return value;
      }),
    );
  }
}
