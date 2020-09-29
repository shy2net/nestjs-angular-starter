import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { promisify } from 'util';

import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

import { UserProfile } from '../../shared/models/user-profile';
import config from '../config';
import { IUserProfileDbModel, UserProfileDbModel } from '../database/models/user-profile.db.model';
import { AppRequest, AppResponse } from '../models';

export function getHashedPassword(password: string): Promise<string> {
  return bcrypt.genSalt().then(salt => {
    return bcrypt.hash(password, salt).then(hash => {
      return hash;
    });
  });
}

export async function saveUser(
  user: UserProfile,
): Promise<IUserProfileDbModel> {
  return UserProfileDbModel.create({
    ...user,
    password: await getHashedPassword(user.password),
  });
}

/**
 * Converts a middleware into a promise, for easier usage.
 * @param middlewareFunc
 * @param req
 * @param res
 */
export function middlewareToPromise(
  middlewareFunc: (req, res, next) => void,
  req: AppRequest,
  res?: AppResponse,
): Promise<unknown> {
  return new Promise(resolve => {
    middlewareFunc(req, res, err => {
      if (err) throw err;
      resolve();
    });
  });
}

export async function sleepAsync(millis: number): Promise<void> {
  await promisify(setTimeout)(millis);
}

/**
 * Returns the HTTPS options, if supported by the environment.
 */
export function getHttpsOptionsFromConfig(): HttpsOptions {
  const readFileIfExists = (filePath: string): Buffer => {
    if (filePath) return fs.readFileSync(filePath);
  };

  const sslConfig = config.SSL_CERTIFICATE;

  return (
    // If there are any SSL configurations
    sslConfig &&
    Object.keys(sslConfig).length > 0 && {
      key: readFileIfExists(config.SSL_CERTIFICATE.KEY),
      cert: readFileIfExists(config.SSL_CERTIFICATE.CERT),
      ca: readFileIfExists(config.SSL_CERTIFICATE.CA),
    }
  );
}
