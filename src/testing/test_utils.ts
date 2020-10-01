import * as request from 'supertest';
import { SuperTest } from 'supertest';

import { INestApplication, ModuleMetadata, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { DatabaseService } from '../database/database.service';
import { IDatabaseService } from '../database/database.service';
import { IUserProfileDbModel, UserProfileDbModel } from '../database/models/user-profile.db.model';
import { DatabaseTestService } from './services/database.test.service';

let nestApp: INestApplication;

export async function createTestModuleWithDB(
  moduleMetadata: ModuleMetadata,
): Promise<{ module: TestingModule; dbService: IDatabaseService }> {
  const module: TestingModule = await Test.createTestingModule({
    imports: moduleMetadata.imports,
    providers: [
      { provide: DatabaseService, useClass: DatabaseTestService },
      ...(moduleMetadata.providers || []),
    ],
    exports: moduleMetadata.exports,
    controllers: moduleMetadata.controllers,
  }).compile();

  const dbService = module.get<IDatabaseService>(DatabaseService);
  await dbService.connect();

  return { module, dbService };
}

/**
 * Returns a supertest request with an already open nest app. Use this
 * for your api testing\e2e.
 */
export async function getRequest(): Promise<SuperTest<request.Test>> {
  const app = await getNestApp();
  return request(app.getHttpServer());
}

/**
 * Returns an already existing instance of nest app, or creates a new one
 * which will be used for other tests as well.
 */
export async function getNestApp(): Promise<INestApplication> {
  if (nestApp) return nestApp;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  nestApp = moduleFixture.createNestApplication();

  // Add validation and transform pipe
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await nestApp.init();
  return nestApp;
}

/**
 * Closes the nest app.
 */
export async function closeNestApp(): Promise<void> {
  if (nestApp) await nestApp.close();
}

/**
 * Returns the root mock user from the database.
 */
export function getMockRootUserFromDB(): Promise<IUserProfileDbModel> {
  return UserProfileDbModel.findOne({ email: 'root@mail.com' }).exec();
}

/**
 * Set the required admin header for testing as root user.
 * @param request
 */
export function setAdminHeaders(request: request.Test): request.Test {
  return request.auth('admin', { type: 'bearer' });
}

/**
 * Set the required viewer header for testing as viewer user.
 * @param request
 */
export function setViewerHeaders(request: request.Test): request.Test {
  return request.auth('viewer', { type: 'bearer' });
}
