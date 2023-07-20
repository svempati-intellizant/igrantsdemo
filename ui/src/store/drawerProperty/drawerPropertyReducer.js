const initial_state = {
  drawerTitle: null,
  activeItem: null,
};

export const drawerPropertyReducer = (state = initial_state, action) => {
  switch (action.type) {
    case "SET_DRAWER_TITLE":
      return { ...state, drawerTitle: action.payload };
    case "SET_ACTIVE_ITEM":
      return { ...state, activeItem: action.payload };
    default:
      return state;
  }
};
