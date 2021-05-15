import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromConfig from './config.reducer';
import { ClientConfig, ConfigState } from './config.reducer';

export const selectConfigState = createFeatureSelector(
  fromConfig.configFeatureKey
);

export const selectConfigFromLocalStorage = createSelector(
  selectConfigState,
  (config: ConfigState) => config.configFromLocalStorage
)

export const selectConfig = createSelector(
  selectConfigState,
  (configState: ConfigState): ClientConfig => {
    let v = new ClientConfig();
    applyConfig(v, configState.configFromLocalStorage);
    applyConfig(v, configState.configFromHost);
    return v;
  }
)

function applyConfig(v, parent) {
  // For each property in parent, copy the value if either:
  //  there is no current property in v,
  //  the parent property is marked 'final'
  if( parent === null || parent ===undefined) {
    return;
  }
  for (let field in parent) {
    if (parent.hasOwnProperty(field) &&
      ( !v.hasOwnProperty(field) || parent[field].isFinal === true)) {
        v[field] = parent[field].value;
      }
  }
}
