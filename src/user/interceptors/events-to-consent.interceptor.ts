import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../entities/user.entity';

@Injectable()
export class EventsToConsentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((user: User) => {
        if (!user.events) {
          return {
            ...user,
            consents: [],
          };
        }

        return user;
      }),
    );
  }
}
