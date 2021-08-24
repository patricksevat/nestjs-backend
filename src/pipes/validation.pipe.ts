import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { userValidators } from '../user/validators/user-validators';

export function validationPipe() {
  return new ValidationPipe({
    exceptionFactory: (errors) => {
      const userFailures = userValidators(errors);
      if (userFailures.length) {
        return userFailures[0];
      }

      return new BadRequestException(errors);
    },
  });
}
