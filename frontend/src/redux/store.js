import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {userReducer} from './reducers';
import {toastReducer} from './reducers';

const rootReducer = combineReducers({userReducer, toastReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
