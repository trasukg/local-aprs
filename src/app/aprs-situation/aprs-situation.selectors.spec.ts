import * as fromAprsSituation from './aprs-situation.reducer';
import { selectAprsSituationState } from './aprs-situation.selectors';

describe('AprsSituation Selectors', () => {
  it('should select the feature state', () => {
    const result = selectAprsSituationState({
      [fromAprsSituation.aprsSituationFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
