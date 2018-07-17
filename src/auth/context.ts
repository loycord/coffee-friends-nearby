import React from 'react';

export interface State {
  uid: string;
  isLoading: boolean;
  isLoggedIn: boolean;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  logIn: () => void;
  logOut: () => void;
}

export const initialState: State = {
  uid: '',
  isLoading: true,
  isLoggedIn: false,
  displayName: '',
  photoURL: '',
  email: '',
  logIn: () => {},
  logOut: () => {}
};

export const AuthContext = React.createContext(initialState);
