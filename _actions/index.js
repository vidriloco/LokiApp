import APIRouter from '../_api/APIRouter';
import { Alert } from 'react-native'

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
		
    	return fetch(url, body).then(response => {
				if(response.ok) {
					dispatch(userLoginSuccess(response.session));
				} else {
					throw new Error("Ups, no pudimos iniciar sesión");
				}
    	}).catch(error => {
				notificationMessageWith("Inicio de sesión", "No pudimos iniciar sesión con el email o nombre de usuario y password que ingresaste. Verifica que sean correctos");
				dispatch(errorState(error));
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
		
    	return fetch(url, body).then(response => {
				if(response.ok) {
					dispatch(userRegistrationSuccess(response.user));
				} else {
					throw new Error("Ups, ocurrió un problema");
				}
	    }).catch(error => {
				notificationMessageWith("Registro", "No pudimos crear tu cuenta con los datos que proporcionaste. Verifica que el email sea válido.");
				dispatch(errorState(error));
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
