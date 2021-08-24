import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEntity } from '../entities/event.entity';

@Injectable()
export class StripActiveInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (value instanceof EventEntity) {
          delete value.active;
        }

        return value;
      }),
    );
  }
}
