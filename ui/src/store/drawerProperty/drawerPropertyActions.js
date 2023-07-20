/**
 * set the loading state while loggin in from auth page
 */
export const setTitle = (title) => {
  return { type: "SET_DRAWER_TITLE", payload: title };
};

export const setLocation = (location) => {
  return { type: "SET_ACTIVE_ITEM", payload: location };
};
