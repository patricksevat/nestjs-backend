import { EventsToConsentInterceptor } from './events-to-consent.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { mockUsers } from '../mocks/user';
import { IUserResponse } from '../entities/user.entity';

describe('EventsToConsentInterceptor', function () {
  it('should return an empty array if no Events are available for user', function (done) {
    const interceptor = new EventsToConsentInterceptor();
    const mockExecutionContext = {} as unknown as ExecutionContext;
    const mockHandler = {
      handle: () => of(mockUsers[0]),
    };
    interceptor
      .intercept(mockExecutionContext, mockHandler)
      .subscribe((value: IUserResponse) => {
        expect(Array.isArray(value.consents)).toBe(true);
        expect(value.consents).toHaveLength(0);
        done();
      });
  });
});
