import { Controller, Get } from '@nestjs/common';

interface TestResponse {
  status: 'ok';
}

@Controller()
export class ApiController {
  @Get('/test')
  test(): TestResponse {
    return { status: 'ok' };
  }
}
