export const SET_LOGGED_USER = 'SET_LOGGED_USER';

export const setLoggedUser = userObj => dispatch => {
  dispatch({
    type: SET_LOGGED_USER,
    payload: userObj,
  });
};
