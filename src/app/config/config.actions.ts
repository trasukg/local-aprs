import { createAction, props } from '@ngrx/store';

export const loadHostConfig = createAction(
  '[Config] Load HostConfig'
);

export const loadHostConfigSuccess = createAction(
  '[Config] Load HostConfig Success',
  props<{ config: any }>()
);

export const loadHostConfigFailure = createAction(
  '[Config] Load HostConfig Failure',
  props<{ error: any }>()
);
