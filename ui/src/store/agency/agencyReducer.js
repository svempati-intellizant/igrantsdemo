const initial_state = {
  dashboardLoadingState: false,
  agencydashboardData: null,
  granteeListLoadingState: false,
  granteeList: null,
  singleMultiLoading: false,
  singleMultiData: null,
  granteeTableStatus: {
    status: "totalGrantee",
    display: "Total Grantee",
  },
};

export const agencyReducer = (state = initial_state, action) => {
  switch (action.type) {
    case "SET_DASHBOARD_DATA":
      return { ...state, agencydashboardData: action.payload };
    case "SET_GRANTEE_LIST":
      return { ...state, granteeList: action.payload };

    case "SET_GRANTEE_TABLE_LIST":
      return {
        ...state,
        granteeTableStatus: action.payload,
      };
    case "SET_DASHBOARD_LOAD_STATE":
      return {
        ...state,
        dashboardLoadingState: action.payload,
      };
    case "SET_FETCH_ALL_GRANTEE_LOAD_STATE":
      return {
        ...state,
        granteeListLoadingState: action.payload,
      };
    case "SET_SINGLE_MULTI_LOADING":
      return {
        ...state,
        singleMultiLoading: action.payload,
      };

    case "SET_SINGLE_MULTI_DATA":
      return {
        ...state,
        singleMultiData: action.payload,
      };
    default:
      return state;
  }
};
