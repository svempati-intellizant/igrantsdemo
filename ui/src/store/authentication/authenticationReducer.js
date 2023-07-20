const initial_state = {
  authLoading: false,
  loginState: false,
  email: null,
  userId: null,
  agency: null,
  role: null,
  token: null,
  error: null,
};

export const authenticationReducer = (state = initial_state, action) => {
  switch (action.type) {
    case "INITIALIZE_LOGIN":
      return { ...state, authLoading: true, error: null };
    case "SET_USER_DATA":
      return {
        ...state,
        authLoading: false,
        loginState: true,
        email: action.payload.email,
        role: action.payload.role,
        token: action.payload.token,
        userId: action.payload._id,
        agency: action.payload.agency ? action.payload.agency : null,
        error: null,
      };
    case "LOGIN_ERR":
      return {
        ...state,
        authLoading: false,
        loginState: false,
        email: null,
        role: null,
        token: null,
        userId: null,
        error: action.payload,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        authLoading: false,
        loginState: false,
        email: null,
        role: null,
        token: null,
        userId: null,
        error: null,
      };
    default:
      return state;
  }
};
