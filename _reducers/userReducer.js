const INITIAL_STATE = {
  username: '',
  email: '',
  login: '',
  password: '',
  authentication_token: '',
  errorFlag: false,
  saving: false
};

export default function users(state = INITIAL_STATE, action) {
  switch (action.type) {
  	case 'USERNAME_CHANGED':
    	return { ...state, username: action.payload };
  	case 'EMAIL_CHANGED':
    	return { ...state, email: action.payload };
		case 'LOGIN_CHANGED':
      return { ...state, login: action.payload };
    case 'PASSWORD_CHANGED':
      return { ...state, password: action.payload };
    case 'LOGIN_FAILED':
      return { ...state, errorFlag: true, password: '', spinner: false };
    case 'USER_LOGIN_SUCCESS':
      return Object.assign({}, state, { saving: false });
    case 'ERROR':
			return Object.assign({}, state, { saving: false });
		case 'BUSY_STATE':
			return Object.assign({}, state, { saving: true });
		case 'USER_CREATION_SUCCESS':
			return Object.assign({}, state, { saving: false });
    default:
      return state;
  }
};