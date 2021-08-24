import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IConsent, User } from '../entities/user.entity';
import { EventEntity } from '../../event/entities/event.entity';

@Injectable()
export class EventsToConsentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (value instanceof User) {
          return {
            id: value.id,
            email: value.email,
            consents: this.getConsents(value?.events?.[0]),
          };
        }

        return value;
      }),
    );
  }

  getConsents(activeEvent: EventEntity): IConsent[] {
    const consents: IConsent[] = [];

    if (!activeEvent) {
      return [];
    }

    if (activeEvent.sms_notifications) {
      consents.push({
        id: 'sms_notifications',
        enabled: true,
      });
    }

    if (activeEvent.email_notifications) {
      consents.push({
        id: 'email_notifications',
        enabled: true,
      });
    }

    return consents;
  }
}
