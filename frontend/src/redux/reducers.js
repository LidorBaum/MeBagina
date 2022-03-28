import {SET_LOGGED_USER} from './actions';
import {NEW_NOTIFICATION, DISMISS_NOTIFICATION} from './actions';

const initialState = {
  loggedUser: null,
};

const notificationState = {
  isShowToast: false,
  toastSeverity: '',
  toastText: 'Test',
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGGED_USER:
      return {...state, loggedUser: action.payload};
    default:
      return state;
  }
}

function toastReducer(state = notificationState, action) {
  switch (action.type) {
    case NEW_NOTIFICATION:
      return {
        ...state,
        isShowToast: true,
        toastSeverity: action.payload.toastSeverity,
        toastText: action.payload.toastText,
      };
    case DISMISS_NOTIFICATION:
      return {...state, isShowToast: false};
    default:
      return state;
  }
}

module.exports = {
  userReducer,
  toastReducer,
};
