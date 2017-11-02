import { Auth, User } from 'api';
import cookie from 'react-cookie';

function login(username, password, isRememberMe) {
  return function(dispatch) {

    return Auth.actions.signin.request(null, {
      data: {
        email: username,
        password: password
      }
    }).then(res => {
      if (res && res.data) {
         let expiresParams = {path: '/'};
         if (isRememberMe) {
           expiresParams = {path: '/', maxAge: 3600*24*365};
         }

         cookie.save('accessToken', res.data.id, expiresParams);
         return dispatch(isAdmin());
      } else {
        console.log('something');
      }
    }).catch( (errors) => {
      return {
        isAuthenticated: false,
        data: errors.response
      }
    });
  }
}

function isAdmin() {
  return function(dispatch) {
    return dispatch(getUserInfo()).then(response => {
      if (response.attributes.roles == 'super_admin') {
        return {
          isAuthenticated: true
        };
      }
      else {
        return {
          isAuthenticated: false
        };
      }
      return {
        isAuthenticated: true
      }
    })
  }
}

function getUserInfo() {
  return function(dispatch) {
    return User.actions.me.request().then(res => {
      dispatch({
        type: 'CURRENT_USER',
        user: res.data.data
      });

      return res.data.data;
    }).catch( (errors) => {
      return {
        isAuthenticated: false,
        data: errors
      }
   });
  }
}

function logout() {
  return function(dispatch) {
    return Auth.actions.signout.request().then(response => {
      cookie.remove('accessToken', {path: '/'});
    });
  }
}

export {login, getUserInfo, logout, isAdmin};
