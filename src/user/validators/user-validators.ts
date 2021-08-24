import { ValidationError } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InvalidEmailError } from '../constants/errors';

export function userValidators(errors: ValidationError[]) {
  return errors.reduce((aggregator, validationError) => {
    if (
      validationError.target instanceof CreateUserDto &&
      validationError.constraints.isEmail
    ) {
      aggregator.push(new InvalidEmailError());
    }

    return aggregator;
  }, []);
}
