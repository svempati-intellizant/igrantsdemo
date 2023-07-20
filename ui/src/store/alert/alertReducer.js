const initial_state = {
  show: false,
  alertType: "success",
  alertText: null,
};

export const alertReducer = (state = initial_state, action) => {
  switch (action.type) {
    case "SET_ALERT_CONTENT":
      return {
        ...state,
        show: true,
        alertType: action.payload.alertType,
        alertText: action.payload.alertText,
      };
    case "RESET_ALERT":
      return {
        show: false,
        alertType: "success",
        alertText: null,
      };
    default:
      return state;
  }
};
