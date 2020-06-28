import { createAction, props } from '@ngrx/store';

/**
  Command to enable the geolocation tracking.
*/
export const startupApplication = createAction(
  '[Application] Startup'
);
