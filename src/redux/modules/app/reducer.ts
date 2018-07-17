import { Action } from '../../types';

export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false
};

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true };
    case 'LOADED':
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export default reducer;
