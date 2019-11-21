import { createAction, props } from '@ngrx/store';

export const loadHostConfigs = createAction(
  '[HostConfig] Load HostConfigs'
);

export const loadHostConfigsSuccess = createAction(
  '[HostConfig] Load HostConfigs Success',
  props<{ config: any }>()
);

export const loadHostConfigsFailure = createAction(
  '[HostConfig] Load HostConfigs Failure',
  props<{ error: any }>()
);
