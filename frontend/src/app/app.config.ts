import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { WebReqInterceptor } from './web-req-interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ]
};
