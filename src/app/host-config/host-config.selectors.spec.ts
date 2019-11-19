import * as fromHostConfig from './host-config.reducer';
import { selectHostConfigState } from './host-config.selectors';

describe('HostConfig Selectors', () => {
  it('should select the feature state', () => {
    const result = selectHostConfigState({
      [fromHostConfig.hostConfigFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
