import { Action, Cafe, SELECT_CAFE } from '../../types';

export interface State {
  // cafes: Cafe[];
  selectedCafe: Cafe | null;
}

const initialState: State = {
  // cafes: [],
  selectedCafe: null
};

function applySelectCafe(state: State, action: SELECT_CAFE) {
  const { cafe } = action;
  return {
    ...state,
    selectedCafe: cafe
  };
}

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'SELECT_CAFE':
      return applySelectCafe(state, action);
    case 'RESET_CAFE':
      return { ...state, selectedCafe: null };
    default:
      return state;
  }
}

export default reducer;
