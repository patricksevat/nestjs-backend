import { Controller, Get } from '@nestjs/common';

@Controller()
export class V1Controller {
  @Get('')
  v1Greeter() {
    return 'hello, v1';
  }
}
