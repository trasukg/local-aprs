import * as fromPosition from './position.reducer';
import { selectPositionState } from './position.selectors';

describe('Position Selectors', () => {
  it('should select the feature state', () => {
    const result = selectPositionState({
      [fromPosition.positionFeatureKey]: fromPosition.initialState
    });

    expect(result).toEqual(fromPosition.initialState);
  });
});
