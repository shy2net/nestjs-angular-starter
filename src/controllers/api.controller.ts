import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { Roles } from '../auth/roles.decorators';
import { UserAuthGuard } from '../auth/user-auth-guard';

interface TestResponse {
  status: 'ok';
}

@Controller()
export class ApiController {
  @Get('/test')
  test(): TestResponse {
    return { status: 'ok' };
  }

  @UseGuards(UserAuthGuard)
  @Roles('admin')
  @Get('/admin')
  admin(): string {
    return `You are an admin!`;
  }

  @Get('/say-something')
  saySomething(@Query('whatToSay') whatToSay: string): { said: string } {
    return { said: whatToSay };
  }
}
