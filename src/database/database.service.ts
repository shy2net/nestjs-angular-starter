import * as mongoose from 'mongoose';

import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { sleepAsync } from '../misc/utils';
import { DatabaseConnectionManager } from './database-connection-manager';
import { DatabaseModuleConfig } from './database.module';

export interface IDatabaseService {
  connect(): Promise<void>;
  close(): Promise<void>;
}

@Injectable()
export class DatabaseService
  implements IDatabaseService, OnModuleInit, OnModuleDestroy {
  connectionManager: DatabaseConnectionManager =
    DatabaseConnectionManager.instance;
  connection: mongoose.Connection;

  constructor(
    @Inject('DATABASE_MODULE_CONFIG')
    private readonly config: DatabaseModuleConfig,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry(this.config.retryCount || 8);
  }

  protected async connectWithRetry(retryCount: number): Promise<void> {
    for (let i = 0; i < retryCount; i++) {
      try {
        await this.connect();
        return;
      } catch (error) {
        Logger.log(`Retrying to connect database in 5 seconds...`);
        await sleepAsync(5000);
      }
    }
  }

  async connect(): Promise<void> {
    this.connection = await this.connectionManager.connectDatabase(
      this.config.uri,
    );
  }

  async close(): Promise<void> {
    const db = mongoose.connection;
    if (db) await db.close();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }
}
