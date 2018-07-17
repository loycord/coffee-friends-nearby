import React from 'react';
import { AuthContext } from './context';
import Login from './Login';

function withAuth(Component: React.ComponentClass<any>) {
  return class extends React.Component {
    public render() {
      return (
        <AuthContext.Consumer>
          {user =>
            user.isLoggedIn ? (
              <Component {...this.props} user={user} />
            ) : (
              <Login logIn={user.logIn} />
            )
          }
        </AuthContext.Consumer>
      );
    }
  };
}

export default withAuth;
