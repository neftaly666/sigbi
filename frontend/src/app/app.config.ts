import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { bearerTokenInterceptor } from './interceptor/bearer-token.interceptor';
import { credentialsInterceptor } from './interceptor/credentials.interceptor';
import { serverErrorInterceptor } from './interceptor/server-error.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      //El orden importa: serverErrorInterceptor va ultimo para envolver a los dos que modifican la peticion
      withInterceptors([credentialsInterceptor, bearerTokenInterceptor, serverErrorInterceptor])
    ),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ]
};
