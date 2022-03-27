export const SET_LOGGED_USER = 'SET_LOGGED_USER';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION';

export const setLoggedUser = userObj => dispatch => {
  dispatch({
    type: SET_LOGGED_USER,
    payload: userObj,
  });
};

export const newNotification =
  ({toastText, toastSeverity}) =>
  dispatch => {
    dispatch({
      type: 'NEW_NOTIFICATION',
      payload: {
        toastText: toastText,
        toastSeverity: toastSeverity,
      },
    });
  };

export const dismissNotification = () => dispatch => {
  dispatch({
    type: 'DISMISS_NOTIFICATION',
    payload: null,
  });
};
