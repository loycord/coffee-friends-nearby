import { Action, User } from '../../types';

export interface State {
  filter: 'cafeId' | 'cafeCity' | 'cafeCountryCode' | 'all';
  members: User[];
  lastDoc: any;
}

const initialState: State = {
  filter: 'cafeId',
  members: [],
  lastDoc: null
};

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'SET_MEMBERS':
      return { ...state, members: action.members };
    case 'CHANGE_MEMBERS_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

export default reducer;
