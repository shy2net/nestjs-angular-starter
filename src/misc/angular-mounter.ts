import * as express from 'express';
import * as path from 'path';

/**
 * Mounts angular using Server-Side-Rendering (Recommended for SEO)
 */
export function mountAngularSSR(expressApp: express.Application): void {
  // The dist folder of compiled angular
  const DIST_FOLDER = path.join(process.cwd(), 'dist/angular');

  // The compiled server file (angular-src/server.ts) path
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ngApp = require(path.join(DIST_FOLDER, 'server/main'));

  // Init the ng-app using SSR
  ngApp.init(expressApp, path.join(DIST_FOLDER, '/browser'));
}

/**
 * Mounts angular as is with no SSR.
 */
export function mountAngular(expressApp: express.Application): void {
  const DIST_FOLDER = path.join(process.cwd(), 'dist/angular/browser');
  // Point static path to Angular 2 distribution
  expressApp.use(express.static(DIST_FOLDER));

  // Deliver the Angular 2 distribution
  expressApp.get('*', function(req, res) {
    res.sendFile(path.join(DIST_FOLDER, 'index.html'));
  });
}
