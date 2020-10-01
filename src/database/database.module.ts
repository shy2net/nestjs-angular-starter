import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseService } from './database.service';

export interface DatabaseModuleConfig {
  uri: string;
  retryCount?: number;
}

/**
 * Responsible of connecting mongo based database, exposes the DatabaseService which handles
 * the first connection. You can create new models at the `models` directory and access the schemas
 * as you would with mongoose.
 *
 * The database will be automatically connected when this module is imported.
 */
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  /**
   * Loads the database connection with the provided configurations.a1
   * If env is set to 'test', will automatically return the in-memory mongo database
   * and ignore all configurations.
   * @param config
   */
  static async register(
    config: DatabaseModuleConfig,
  ): Promise<DynamicModule> {
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
  static async forTest(): Promise<DynamicModule> {
    /* We are using lazy import, because if running on production and will be imported normally,
    it will fail because of missing dev dependencies import */
    const dbTestImport = await import(
      '../testing/services/database.test.service'
    );

    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DatabaseService,
          useClass: dbTestImport.DatabaseTestService,
        },
      ],
    };
  }
}
