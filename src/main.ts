import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import {
  provideTanStackQuery,
  QueryClient,
} from "@tanstack/angular-query-experimental";
import "zone.js";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideTanStackQuery(new QueryClient()),
  ],
}).catch((err) => console.error(err));
