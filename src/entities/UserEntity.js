import {reactive, toRefs} from "vue";

const state = reactive({
  user: {
    email: null,
    name: null,
    token: null,
    isLoggedIn: false,
    loginProcessed: false,
  },
});

export default function useUser() {
  const setUser = (user) => {
    state.user.email = user['email'];
    state.user.name = user['name']
  };

  const setToken = (token) => {
    localStorage.setItem('auth_token', token);
    state.user.token = token;
  }

  const getToken = () => {
    if (!state.user.token) {
      const localStorageToken = localStorage.getItem('auth_token');
      state.user.token = localStorageToken ? localStorageToken : null;
    }
    return state.user.token;
  }

  const setLogged = (loginState = false) => {
    state.user.isLoggedIn = loginState;
  }

  const setLoginProcessed = (loginProcessed = false) => {
    state.user.loginProcessed = loginProcessed;
  }

  const isLoggedIn = () => {
    return state.user.isLoggedIn;
  };
  const isLoginProcessed = () => {
    return state.user.loginProcessed;
  };

  const clearUser = () => {
    state.user = {
      email: null,
      name: null,
      token: null,
      isLoggedIn: false,
    };
    localStorage.removeItem('auth_token');
  };

  return {
    ...toRefs(state),
    setUser,
    clearUser,
    setToken,
    isLoggedIn,
    getToken,
    setLogged,
    isLoginProcessed,
    setLoginProcessed,
  };
}
