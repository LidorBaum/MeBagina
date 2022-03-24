import Axios from 'axios';
const { baseURL } = require('../config');
// const { baseURL } = import('../config');
// const baseURL  = 'http://192.168.1.20:4444'

const API_URL = `${baseURL}/api/`;

export default {
  get(endpoint, data, userId) {
    return ajax(endpoint, 'GET', data, userId);
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data);
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data);
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data);
  },
};

async function ajax(endpoint, method = 'get', data = null, userId= null) {
  try {
    const axios = Axios.create({
      withCredentials: true,
      headers: {
        userId: userId
      },
    });

    const res = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      data,
    });

    return res.data;
  } catch (err) {
    if (!err.response) console.warn(err);
    return {
      error: {
        message: 'Oops, there is a problem with the server, please try again',
        status: 500,
      },
    };
    return {
      error: {
        message: err.response.data,
        status: err.response.status,
      },
    };
  }
}
