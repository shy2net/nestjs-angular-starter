import { Controller, Get, Query } from '@nestjs/common';

interface TestResponse {
  status: 'ok';
}

@Controller()
export class ApiController {
  @Get('/test')
  test(): TestResponse {
    return { status: 'ok' };
  }

  @Get('/say-something')
  saySomething(@Query('whatToSay') whatToSay: string): { said: string } {
    return { said: whatToSay };
  }
}
