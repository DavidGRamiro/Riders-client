import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './core/interceptors/request.interceptor';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';
import { Theme } from './ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([requestInterceptor])),
    provideSpartanHlm(),
    provideAppInitializer(() => {
      // Config to set by default in the app.
      const theme = inject(Theme);
      theme.userTheme();
    })
  ]
};
