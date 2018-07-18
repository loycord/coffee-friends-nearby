import { Action, Room, SET_ROOMS, CREATE_ROOM } from '../../types';

export interface State {
  rooms: Room[];
  unseenMessages: number;
}

const initialState: State = {
  rooms: [],
  unseenMessages: 0
};

function docDataMerge(oldArray: Array<any>, newArray: Array<any>): Room[] {
  const updatedData = oldArray.map(oldObj => {
    const findData = newArray.find(newObj => newObj.docId === oldObj.docId);
    if (findData) {
      return findData;
    }
    return oldObj;
  });
  console.log('UPDATE_DATE_ROOM: ', updatedData);
  const newData = newArray.filter(
    newObj => !oldArray.find(oldObj => newObj.docId === oldObj.docId)
  );
  console.log('NEW_DATA_ROOM: ', newData);
  return [...updatedData, ...newData];
}

function setRooms(state: State, action: SET_ROOMS): State {
  const { rooms } = action;
  const updatedData = docDataMerge(state.rooms, rooms);
  console.log('UPDATED_DATA_ROOM: ', updatedData);
  updatedData.sort(
    (a: Room, b: Room) => a.updatedAt.seconds - b.updatedAt.seconds
  );

  return {
    ...state,
    rooms: updatedData
  };
}

function applyCreateRoom(state: State, action: CREATE_ROOM): State {
  const { room } = action;
  return {
    ...state,
    rooms: [room, ...state.rooms]
  };
}

function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'SET_ROOMS':
      return setRooms(state, action);
    case 'CREATE_ROOM':
      return applyCreateRoom(state, action);
    default:
      return state;
  }
}

export default reducer;
