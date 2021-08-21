import { EventsToConsentInterceptor } from './events-to-consent.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { mockUsers } from '../mocks/user';
import { IUserResponse } from '../entities/user.entity';

describe('EventsToConsentInterceptor', function () {
  let interceptor, mockExecutionContext, mockHandler;

  beforeEach(() => {
    interceptor = new EventsToConsentInterceptor();
    mockExecutionContext = {} as unknown as ExecutionContext;
    mockHandler = {
      handle: () => of(mockUsers[0]),
    };
  });

  it('should return an empty array if no Events are available for user', function (done) {
    interceptor
      .intercept(mockExecutionContext, mockHandler)
      .subscribe((value: IUserResponse) => {
        expect(Array.isArray(value.consents)).toBe(true);
        expect(value.consents).toHaveLength(0);
        done();
      });
  });

  it('should not include the active property', function (done) {
    interceptor
      .intercept(mockExecutionContext, mockHandler)
      .subscribe((value: any) => {
        expect(value.active).toBe(undefined);
        done();
      });
  });
});
