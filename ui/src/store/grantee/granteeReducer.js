const initial_state = {
  granteeList: [],
  grantList: {
    granteeId: null,
    grants: [],
    tableData: [],
  },
  riskQuestionsData: {
    granteeProjectId: null,
    questions: [],
  },

  allGrants: null,
  allGrantsLoading: false,
};

export const granteeReducer = (state = initial_state, action) => {
  switch (action.type) {
    case "SET_GRANTEE_LIST":
      return { ...state, granteeList: action.payload };
    case "SET_PROJECT_LIST":
      return {
        ...state,
        grantList: {
          granteeId: action.payload.granteeId,
          grants: action.payload.grants,
          tableData: action.payload.tableData,
        },
      };

    case "SET_QUESTION_LIST":
      return {
        ...state,
        riskQuestionsData: {
          granteeProjectId: action.payload.granteeProjectId,
          questions: action.payload.questions,
        },
      };

    case "SET_GRANT_LIST":
      return {
        ...state,
        grantList: {
          granteeId: action.payload.granteeId,
          grants: state.grantList.grants,
          tableData:
            action.payload.status !== "total"
              ? state.grantList.grants.filter(
                  (ele) => ele.grant_status === action.payload.status
                )
              : state.grantList.grants,
        },
      };
    case "SET_ALLGRANTS_DATA":
      return {
        ...state,
        allGrants: action.payload,
      };

    case "SET_ALLGRANTS_LOADING":
      return {
        ...state,
        allGrantsLoading: action.payload,
      };
    default:
      return state;
  }
};
