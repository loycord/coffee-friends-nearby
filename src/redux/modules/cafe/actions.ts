import { Action, Cafe, Dispatch } from '../../types';

export const _selectCafe = (cafe: Cafe): Action => ({
  type: 'SELECT_CAFE',
  cafe
});

export function selectCafe(cafe: Cafe): Dispatch {
  return dispatch => {
    dispatch(_selectCafe(cafe));
  };
}
