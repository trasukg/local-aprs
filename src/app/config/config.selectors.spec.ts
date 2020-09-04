import * as fromHostConfig from './config.reducer';
import { selectConfigState } from './config.selectors';

describe('Config Selectors', () => {
  it('should select the feature state', () => {
    const result = selectConfigState({
      [fromHostConfig.configFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
