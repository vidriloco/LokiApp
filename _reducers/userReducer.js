const INITIAL_STATE = {
  login: '',
  password: '',
  authentication_token: '',
  username: '',
  errorFlag: false,
  saving: false
};

export default function users(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOGIN_CHANGED':
      return { ...state, email: action.payload };
    case 'PASSWORD_CHANGED':
      return { ...state, password: action.payload };
    case 'LOGIN_FAILED':
      return { ...state, errorFlag: true, password: '', spinner: false };
    case 'LOGIN_USER_SUCCESS':
      return { ...state, ...action.payload, ...INITIAL_STATE };
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