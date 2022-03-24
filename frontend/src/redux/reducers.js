import {SET_LOGGED_USER} from './actions';

const initialState = {
  loggedUser: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGGED_USER:
      return {...state, loggedUser: action.payload};
    default:
      return state;
  }
}

export default userReducer;
