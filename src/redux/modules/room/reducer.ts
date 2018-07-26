import { Action, Room, SET_ROOMS, CREATE_ROOM } from '../../types';
import { docDataMerge } from '../../../lib/utils';

export interface State {
  rooms: Room[];
  unseenMessages: number;
  unsubscribeFrom?: any;
  unsubscribeTo?: any;
}

const initialState: State = {
  rooms: [],
  unseenMessages: 0
};

function setRooms(state: State, action: SET_ROOMS): State {
  const { rooms } = action;
  const updatedData = docDataMerge(state.rooms, rooms);
  // console.log('UPDATED_DATA_ROOM: ', updatedData);
  updatedData.sort(
    (a: Room, b: Room) => b.updatedAt.seconds - a.updatedAt.seconds
  );

  return {
    ...state,
    rooms: updatedData
  };
}

function applyCreateRoom(state: State, action: CREATE_ROOM): State {
  const { room } = action;
  console.log(room);
  return state;
}

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'SET_ROOMS':
      return setRooms(state, action);
    case 'CREATE_ROOM':
      return applyCreateRoom(state, action);
    case 'SET_UNSUBSCRIBE':
      return {
        ...state,
        unsubscribeFrom: action.unsubscribeFrom,
        unsubscribeTo: action.unsubscribeTo
      };
    case 'LOGGED_OUT':
      return initialState;
    default:
      return state;
  }
}

export default reducer;
