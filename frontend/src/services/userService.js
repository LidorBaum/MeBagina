import httpService from './httpService';

export default {
  getUsers,
  getById,
  remove,
  updateUser,
  checkUserExistAndType,
  getFilteredUsers,
  getByFirebaseUID,
  createUser,
};

function getFilteredUsers(filter = null) {
  if (filter) return httpService.get(`user/sorted?filter=${filter}`);
  return httpService.get(`user/sorted`);
}

function checkUserExistAndType(name) {
  return httpService.get(`user/type/${name}`);
}

function getUsers() {
  return httpService.get('user');
}

function getByFirebaseUID(firebaseUID) {
  return httpService.get(`user/${firebaseUID}`);
}

function getById(userId) {
  return httpService.get(`user/mongoid/${userId}`);
}
function remove(userId) {
  return httpService.delete(`user/${userId}`);
}

function createUser(userObj) {
  return httpService.post('user', userObj);
}

function updateUser(user) {
  return httpService.put(`user/edit/${user._id}`, user);
}

async function adminLogin(userCred) {
  const user = await httpService.post('auth/login', userCred);
  return _handleLogin(user);
}

async function login(user) {
  return _handleLogin(user);
}

async function signup(userCred) {
  const user = await httpService.post('auth/signup', userCred);
  return _handleLogin(user);
}
async function logout() {
  Cookies.remove('user');
  sessionStorage.clear();
}
function _handleLogin(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
  Cookies.set('user', JSON.stringify(user));
  return user;
}
