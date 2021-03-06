import { createAction, props } from '@ngrx/store';

/**
 * Command to enable the geolocation tracking.
 */
export const enablePosition = createAction(
  '[Position] Enable Position'
);

/**
 * Reports successful disablement of the position monitoring.
 */
export const disablePositionSuccess = createAction(
  '[Position] Disable Position Success'
);

/**
 * Command to enable the geolocation tracking.
 */
export const disablePosition = createAction(
  '[Position] Disable Position'
);

/**
 * Reports the current position as generated by the geolocation API.
 * The position report indirectly indicates that the position monitor was
 * successfully enabled (the geolocation API doesn't specifically report success).
 */
export const reportPosition = createAction(
  '[Position] Report Position',
  props<{ position: any }>()
);

/**
 * Reports the failure to enable position monitoring.
 */
export const positionFailure = createAction(
  '[Position] Position Failure',
  props<{ error: any }>()
);
