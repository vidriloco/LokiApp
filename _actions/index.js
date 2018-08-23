import APIRouter from '../_api/APIRouter';
import { Alert } from 'react-native'
import LocalStore from '../_helpers/LocalStore';

export function logIn(username, password) {
	return function(dispatch) {
		
		if(typeof username === 'undefined' || username.length == 0) {
			return;
		}
		
		if(typeof password === 'undefined' || password.length == 0) {
			return;
		}
		
		dispatch(busyStateInitiated());
		var {url, body} = APIRouter.userLogin(username, password);
		
    return fetch(url, body)
			.then(APIRouter.handleErrors)
			.then(response => {
				LocalStore.setCurrentUserToken(response.user.authToken);
				LocalStore.setCurrentUserRole(response.user.role);
				dispatch(userLoginSuccess(response.user));
	    }).catch(error => {
				error.json().then(errorJSON => {
					notificationMessageWith("Inicio de sesión", errorJSON.message);
					dispatch(errorState(errorJSON));
				});
			});
  	};
}

export function signUp(username, email, password) {
	return function(dispatch) {
		
		if(typeof username === 'undefined' || username.length == 0) {
			notificationMessageWith("Registro", "Es necesario un nombre de usuario para crear una cuenta");
			return;
		}
		
		if(typeof email === 'undefined' || email.length == 0) {
			notificationMessageWith("Registro", "Es necesario proporcionar un e-mail para crear una cuenta");
			return;
		}
		
		if(typeof password === 'undefined' || password.length == 0) {
			notificationMessageWith("Inicio de sesión", "Es necesario una contraseña para iniciar sesión");
			return;
		}
		
		dispatch(busyStateInitiated());
		var {url, body} = APIRouter.userRegistration(username, email, password);
		
		return fetch(url, body)
			.then(APIRouter.handleErrors)
			.then(response => {				
				LocalStore.setCurrentUserToken(response.user.authToken);
				LocalStore.setCurrentUserRole(response.user.role);
				dispatch(userRegistrationSuccess(response.user));
	    }).catch(error => {
				error.json().then(errorJSON => {
					notificationMessageWith("Registro", errorJSON.message);
					dispatch(errorState(errorJSON));
			});
		});
  };
}

function notificationMessageWith(title, message) {
	Alert.alert(
	  title,
	  message,
	  [
	    {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
	  ],
	  { cancelable: false }
	)
}

// Constants for login/sign-up events

export const emailChanged = (email) => {
  return {
    type: 'EMAIL_CHANGED',
    payload: email
  };
};

export const usernameChanged = (username) => {
  return {
    type: 'USERNAME_CHANGED',
    payload: username
  };
};

export const loginChanged = (login) => {
  return {
    type: 'LOGIN_CHANGED',
    payload: login
  };
};

export const passwordChanged = (password) => {
  return {
    type: 'PASSWORD_CHANGED',
    payload: password
  };
};

// Functions for login/sign-up events

export function userLoginSuccess(user) {  
  return {type: 'USER_LOGIN_SUCCESS', user};
}

export function userRegistrationSuccess(user) {  
  return {type: 'USER_CREATION_SUCCESS', user};
}

// Shared states throughout the app

export function busyStateInitiated() {  
  return {type: 'BUSY_STATE'};
}

export function errorState(error) {  
  return {type: 'ERROR', error};
}
