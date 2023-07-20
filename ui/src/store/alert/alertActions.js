const setAlertOn = (alertContent) => {
  return { type: "SET_ALERT_CONTENT", payload: alertContent };
};

export const resetAlert = () => {
  return { type: "RESET_ALERT" };
};

export const setAlert = (alertContent) => {
  return (dispatch) => {
    dispatch(setAlertOn(alertContent));
    setTimeout(function () {
      dispatch(resetAlert());
    }, 5000);
  };
};
