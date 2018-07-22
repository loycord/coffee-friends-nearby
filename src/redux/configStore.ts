import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {
  persistStore,
  persistReducer
  // persistCombineReducers
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// Reducer
import user from './modules/user';
import app from './modules/app';
import gps from './modules/gps';
import post from './modules/post';
import cafe from './modules/cafe';
import room from './modules/room';
import member from './modules/member';

const config = {
  key: 'root',
  storage
};

const rootReducer = combineReducers({
  user: persistReducer(config, user),
  app,
  gps,
  post,
  cafe,
  room,
  member
});

// cSpell: ignore persistor
function configureStore() {
  // ...
  const store = createStore(
    rootReducer,
    compose(applyMiddleware(thunk, logger))
  );
  const persistor = persistStore(store);

  return { persistor, store };
}

export default configureStore;
