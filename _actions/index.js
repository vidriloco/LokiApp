import APIRouter from '../_api/APIRouter';
import { Alert } from 'react-native'

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

export function logIn(username, password) {
	return function(dispatch) {
		
		if(typeof username === 'undefined' || username.length == 0) {
			notificationMessageWith("Inicio de sesión", "Es necesario un nombre de usuario o email para iniciar sesión");
			return;
		}
		
		if(typeof password === 'undefined' || password.length == 0) {
			notificationMessageWith("Inicio de sesión", "Es necesario una contraseña para iniciar sesión");
			return;
		}
		
		dispatch(busyStateInitiated());
		var {url, body} = APIRouter.userLogin(username, password);
		
    	return fetch(url, body).then(response => {
			if(response.ok) {
				dispatch(createUserSuccess(user));
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
		
		dispatch(busyStateInitiated());
		var {url, body} = APIRouter.userLogin(username, email);
		
    	return fetch(url, body).then(response => {
			if(response.ok) {
				dispatch(createUserSuccess(user));
			} else {
				throw new Error("Ups, ocurrió un problema");
			}
    	}).catch(error => {
			alert(error);
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

export function busyStateInitiated() {  
  return {type: 'BUSY_STATE'};
}

export function loadUsersSuccess(cats) {  
  return {type: 'LOAD_CATS_SUCCESS', cats};
}

export function errorState(error) {  
  return {type: 'ERROR', error};
}

export function createUserSuccess(user) {  
  return {type: 'USER_CREATION_SUCCESS', user};
}