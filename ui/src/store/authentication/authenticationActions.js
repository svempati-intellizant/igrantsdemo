import axiosInstance from "../../utils/axios/axios";

/**
 * set the loading state while loggin in from auth page
 */
export const authLoading = () => {
  return { type: "INITIALIZE_LOGIN" };
};
/**
 * Set the users data after loging in or verifying
 */
export const setUserData = (userData) => {
  return { type: "SET_USER_DATA", payload: userData };
};
/**
 * Set the error of logging in at any step
 */
export const loginError = (error) => {
  return { type: "LOGIN_ERR", payload: error };
};

/**
 * Call this function with the required data to HIT THE LOGIN ENDPOINT
 */
export const loginUser = (body) => {
  return (dispatch) => {
    dispatch(authLoading());
    axiosInstance
      .post("/auth/login", body)
      .then((res) => {
        if (res.data) {
          console.log("loginUser action output - SUCCESS", res.data);
          localStorage.setItem("igrant_userid", res.data._id);
          localStorage.setItem("igrant_role", res.data.role);
          localStorage.setItem("igrant_token", res.data.token);
          localStorage.setItem("igrant_email", res.data.email);
          dispatch(setUserData(res.data));
        }
      })
      .catch((err) => {
        console.log(
          "loginUser action output - ERROR",
          err.response.data.payload
        );
        dispatch(loginError(err.response.data.payload));
      });
  };
};
/**
 * Call this function to HIT THE VERIFY ENDPOINT
 */
export const verifyUser = () => {
  return (dispatch) => {
    const token = localStorage.getItem("igrant_token");
    if (token) {
      return axiosInstance
        .get(`/users/me`)
        .then((res) => {
          console.log("verifyUser action output - SUCCESS", res.data);
          localStorage.setItem("igrant_email", res.data.email);
          dispatch(setUserData(res.data));
          return Promise.resolve(res.data);
        })
        .catch((err) => {
          if (err.response) {
            console.log("verifyUser action output - SUCCESS", err.response);
            if (err.response.data.code === 401) {
              localStorage.removeItem("igrant_userid");
              localStorage.removeItem("igrant_role");
              localStorage.removeItem("igrant_token");
              localStorage.removeItem("igrant_email");
            }
          }
          dispatch(loginError(err.response.data.message));
          return Promise.resolve(err.response);
        });
    } else {
      dispatch(loginError(null));
      return Promise.resolve(null);
    }
  };
};
/**
 *  Call this function to log the user outside
 */

export const logOutUser = () => {
  localStorage.removeItem("igrant_userid");
  localStorage.removeItem("igrant_role");
  localStorage.removeItem("igrant_token");
  localStorage.removeItem("igrant_email");
  return { type: "LOGOUT_USER" };
};
