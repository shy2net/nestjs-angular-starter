import { generateMockRootUser, generateMockViewerUser } from '../../shared/testing/mock/user.mock';
import { UserProfileDbModel } from '../database/models';
import { saveUser } from '../misc/utils';
import { DatabaseTestService } from './services/database.test.service';

export class TestDBSetup {
  private static _instance: TestDBSetup;
  static get instance(): TestDBSetup {
    if (!this._instance) this._instance = new TestDBSetup();

    return this._instance;
  }

  /**
   * Setup the database with mocks and required data.
   */
  async setup(): Promise<void> {
    await this.format();
    await this.createUsers();
  }

  /**
   * Cleans up the database from any data.
   */
  async format(): Promise<void> {
    await UserProfileDbModel.deleteMany({});
  }

  /**
   * Create mock users required for the api tests to run.
   */
  async createUsers(): Promise<void> {
    // Create a root user which we can connect later to
    const rootUser = generateMockRootUser();
    // Create a viewer user which we can connect later
    const viewerUser = generateMockViewerUser();

    await Promise.all([saveUser(rootUser), saveUser(viewerUser)]);
  }

  /**
   * Cleans up the database with any 'unrelated' mock objects, which are not the required
   * mocks. This is required in order to perform clean api tests.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async cleanup(): Promise<void> {}
}

/**
 * Performs clean up of the test database before each run to clear it for tests.
 */
export async function cleanTestDB(): Promise<void> {
  if (!TestDBSetup.instance) throw new Error(`Test database was not set up!`);
  await TestDBSetup.instance.cleanup();
}

export async function closeTestDB(): Promise<void> {
  await DatabaseTestService.instance?.close();
}
