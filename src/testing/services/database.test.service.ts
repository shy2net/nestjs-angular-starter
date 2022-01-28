import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { IDatabaseService } from '../../database/database.service';
import { TestDBSetup } from '../test_db_setup';

/**
 * The database test service mocks the original database service, by creating a mongo-in-memory server
 * instead of using the real database.
 */
@Injectable()
export class DatabaseTestService
  implements IDatabaseService, OnModuleInit, OnModuleDestroy {
  // A singletone approach to get the handle to the database on tests and easily close it
  static instance: DatabaseTestService;

  // Create an instance of the in-memory mongo database
  protected mongoServer = new MongoMemoryServer();

  constructor() {
    // Set the instance
    DatabaseTestService.instance = this;
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  /**
   * Sets up the in-memory mongo database, connects to the database and starts the server.
   */
  async connect(): Promise<void> {
    const uri = await this.mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    await TestDBSetup.instance.setup();
  }

  /**
   * Closes the database connection and it's related mongo server emulator.
   */
  async close(): Promise<void> {
    const db = mongoose.connection;
    if (db) await db.close();
    await this.mongoServer.stop();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }
}
