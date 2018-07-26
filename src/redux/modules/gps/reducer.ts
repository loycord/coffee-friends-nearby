import { Action, Location } from '../../types';

export interface State {
  location: Location | null;
}

const initialState: State = {
  location: null
};

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'SET_GPS':
      return { ...state, location: action.location };
    case 'LOGGED_OUT':
      return initialState;
    default:
      return state;
  }
}

export default reducer;
