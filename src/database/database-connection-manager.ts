import * as mongoose from 'mongoose';

import { Logger } from '@nestjs/common';

/**
 * Allows managing open database connections easily.
 * Use as a single instance only.
 */
export class DatabaseConnectionManager {
  private static _instance: DatabaseConnectionManager;
  static get instance(): DatabaseConnectionManager {
    if (!this._instance) this._instance = new DatabaseConnectionManager();

    return this._instance;
  }

  private _connections: mongoose.Connection[] = [];

  /**
   * The list of connections currently opened.
   *
   * @readonly
   * @type {mongoose.Connection[]}
   * @memberof DatabaseConnectionManager
   */
  get connections(): mongoose.Connection[] {
    return this._connections;
  }

  /**
   * Returns the 1st open connection (if exists).
   *
   * @readonly
   * @type {mongoose.Connection}
   * @memberof DatabaseConnectionManager
   */
  get openConnection(): mongoose.Connection {
    return this._connections.length > 0 && this._connections[0];
  }

  /**
   * Connects to the specific mongo database, and stores the connection in the list of connections.
   * @param uri
   */
  connectDatabase(uri: string): Promise<mongoose.Connection> {
    return new Promise((resolve, reject) => {
      Logger.log(`Connecting to database...`);

      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });

      const connection = mongoose.connection;

      connection.on('error', error => {
        Logger.error('Failed to connect to MongoDB server: ${error}');
        reject(error);
      });

      connection.once('open', () => {
        Logger.log('Connected to MongoDB server');

        // Add this connection to the list of connections
        this._connections.push(connection);

        // Clear this connection after it was closed
        connection.once('close', () => {
          // Remove this connection from the list of connections
          this._connections.splice(
            this._connections.findIndex(c => c === connection),
            1,
          );
        });

        // Return the connection
        resolve(connection);
      });
    });
  }

  /**
   * Closes all of the connections currently opened.
   */
  closeConnections(): Promise<mongoose.Connection[]> {
    return Promise.all(
      this._connections.map(async c => {
        await c.close();
        return c;
      }),
    );
  }
}
