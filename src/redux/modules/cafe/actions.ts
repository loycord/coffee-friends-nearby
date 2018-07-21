import { Action, Cafe, Dispatch } from '../../types';

export const _selectCafe = (cafe: Cafe): Action => ({
  type: 'SELECT_CAFE',
  cafe
});

export const _resetCafe = (): Action => ({ type: 'RESET_CAFE' });

export function selectCafe(cafe: Cafe): Dispatch {
  return dispatch => {
    dispatch(_selectCafe(cafe));
  };
}

export function resetCafe(): Dispatch {
  return dispatch => {
    dispatch(_resetCafe());
  };
}
