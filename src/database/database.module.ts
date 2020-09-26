import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseTestService } from '../testing/services/database.test.service';
import { DatabaseService } from './database.service';

export interface DatabaseModuleConfig {
  uri: string;
  retryCount?: number;
}

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  static withConfig(config: DatabaseModuleConfig): DynamicModule {
    // If we are running on test, return the test module
    if (process.env.NODE_ENV === 'test') return DatabaseModule.forTest();

    return {
      module: DatabaseModule,
      providers: [{ provide: 'DATABASE_MODULE_CONFIG', useValue: config }],
    };
  }

  /**
   * Uses the database module for test environment, which uses in-memory mongo database.
   */
  static forTest(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [{ provide: DatabaseService, useClass: DatabaseTestService }],
    };
  }
}
