import {
  Action,
  User,
  LOGGED_IN,
  UPDATE_USER_FAVORITE_CAFE
} from '../../types';

export interface State extends User {
  isLoggedIn: boolean;
}

const initialState: State = {
  uid: '',
  displayName: '',
  photoURL: '',
  email: '',
  isLoggedIn: false,
  isConnected: true
};

function applySetUser(state: State, action: LOGGED_IN) {
  const { user } = action;
  return {
    ...state,
    ...user,
    isLoggedIn: true
  };
}

function applySetUserCafe(state: State, action: UPDATE_USER_FAVORITE_CAFE) {
  const { cafe } = action;
  return {
    ...state,
    cafeId: cafe.docId,
    cafeName: cafe.name,
    cafeCity: cafe.city,
    cafeCountryCode: cafe.countryCode
  };
}

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'LOGGED_IN':
      return applySetUser(state, action);
    case 'LOGGED_OUT':
      return initialState;
    case 'UPDATE_USER_CONNECTED':
      return { ...state, isConnected: action.isConnected };
    case 'UPDATE_USER_FAVORITE_CAFE':
      return applySetUserCafe(state, action);
    default:
      return state;
  }
}

export default reducer;
