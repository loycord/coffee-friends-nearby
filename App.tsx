// cSpell: ignore persistor

import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Root from './src/Root';

import configureStore from './src/redux/configStore';

const { persistor, store } = configureStore();

const onBeforeLift = () => {
  // take some action before the gate lifts
};

export default () => {
  const config = {
    apiKey: 'AIzaSyC8Vm_QJth1ZFqJVcrwPktyMiuYzM--fSM',
    authDomain: 'coffee-friends-nearby.firebaseapp.com',
    databaseURL: 'https://coffee-friends-nearby.firebaseio.com',
    projectId: 'coffee-friends-nearby',
    storageBucket: 'coffee-friends-nearby.appspot.com',
    messagingSenderId: '687373534166'
  };
  firebase.initializeApp(config);

  const firestore = firebase.firestore();
  const settings = { /* your settings... */ timestampsInSnapshots: true };
  firestore.settings(settings);

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        onBeforeLift={onBeforeLift}
        persistor={persistor}
      >
        <Root />
      </PersistGate>
    </Provider>
  );
};
