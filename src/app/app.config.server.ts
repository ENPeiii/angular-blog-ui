import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideApiConfiguration } from './api/api-configuration';
import { environment } from '../environments/environment';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideApiConfiguration(environment.apiBaseUrl),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
