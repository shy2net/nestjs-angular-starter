import * as express from 'express';
import path from 'path';

/**
 * Mounts angular using Server-Side-Rendering (Recommended for SEO)
 */
export function mountAngularSSR(expressApp: express.Application): void {
  // The dist folder of compiled angular
  const DIST_FOLDER = path.join(__dirname, 'dist');

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
  // Point static path to Angular 2 distribution
  expressApp.use(express.static(path.join(__dirname, 'dist/browser')));

  // Deliever the Angular 2 distribution
  expressApp.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/browser/index.html'));
  });
}
