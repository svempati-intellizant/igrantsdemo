import { setAlert, resetAlert } from "../alert/alertActions";
import axiosInstance from "../../utils/axios/axios";
import { successToast, errorToast } from "../../utils/toast/toast";

export const dashDataLoadingState = (loadState) => {
  return { type: "SET_DASHBOARD_LOAD_STATE", payload: loadState };
};
export const allGranteeLoadingState = (loadState) => {
  return { type: "SET_FETCH_ALL_GRANTEE_LOAD_STATE", payload: loadState };
};
export const setDashboardData = (list) => {
  // make api call to fetch grantee list
  return { type: "SET_DASHBOARD_DATA", payload: list };
};
export const setGranteeTableList = (data) => {
  return { type: "SET_GRANTEE_TABLE_LIST", payload: data };
};
export const setGranteeList = (list) => {
  // make api call to fetch grantee list
  return { type: "SET_GRANTEE_LIST", payload: list };
};
export const setSingleMultiLoading = (state) => {
  return { type: "SET_SINGLE_MULTI_LOADING", payload: state };
};
export const setSingleMultiData = (data) => {
  return { type: "SET_SINGLE_MULTI_DATA", payload: data };
};

/* fetch agency dashboard*/
export const fetchAgencyDashboardData = () => {
  return (dispatch) => {
    dispatch(dashDataLoadingState(true));
    return axiosInstance
      .get("/dashboard")
      .then((res) => {
        if (res.data) {
          dispatch(setDashboardData(res.data));
          dispatch(dashDataLoadingState(false));
          console.log("fetch agency dashboard  output - SUCCESS", res.data);
          return Promise.resolve(res.data);
        } else {
          dispatch(dashDataLoadingState(false));
          Promise.reject("error");
        }
      })
      .catch((err) => {
        dispatch(dashDataLoadingState(false));
        console.log(
          "fetch agency dashboard  output - ERROR",
          err.response.data.payload
        );
        dispatch(
          setAlert({
            alertType: "error",
            alertText: err.response.data.payload,
          })
        );
        return Promise.reject({ error: err.response.data.payload });
      });
  };
};
/*fetch agency grantee list*/
export const fetchALLGranteeList = () => {
  return (dispatch) => {
    dispatch(allGranteeLoadingState(true));
    return axiosInstance
      .get("/grantee-master/getAgencyGranteeList")
      .then((res) => {
        if (res.data) {
          dispatch(setGranteeList(res.data));
          dispatch(allGranteeLoadingState(false));
          console.log("Fetch grantee list action output - SUCCESS", res.data);
          return Promise.resolve(res.data);
        }
      })
      .catch((err) => {
        console.log("Fetch grantee list action output - ERROR", err.response);
        dispatch(setGranteeList(null));
        dispatch(allGranteeLoadingState(false));
        return Promise.reject({ error: err.response });
      });
  };
};
/*fetch individual grant data by grant id*/
export const fetchIndividualGrantDetail = (grantId) => {
  return (dispatch) => {
    return axiosInstance
      .get("grantee-grant/risk_analysis/" + grantId)
      .then((res) => {
        if (res.data) {
          console.log(
            "fetch individual grant data by grant id - SUCCESS",
            res.data
          );
          return Promise.resolve(res.data);
        }
      })
      .catch((err) => {
        console.log(
          "fetch individual grant data by grant id - ERROR",
          err.response.data.payload
        );
        dispatch(setGranteeList(null));
        return Promise.reject({ error: err.response.data.payload });
      });
  };
};
/** fetch single multi grant */
export const fetchSingleMultiData = () => {
  return (dispatch) => {
    dispatch(setSingleMultiLoading(true));
    return axiosInstance
      .get("/grantee-master/singleMultiGrant")
      .then((res) => {
        if (res.data) {
          dispatch(setSingleMultiData(res.data));
          dispatch(setSingleMultiLoading(false));
          console.log("fetch single multi grant output - SUCCESS", res.data);
          return Promise.resolve(res.data);
        }
      })
      .catch((err) => {
        console.log("fetch single multi grant output - ERROR", err.response);
        dispatch(setSingleMultiData(null));
        dispatch(setSingleMultiLoading(false));
        return Promise.reject({ error: err.response });
      });
  };
};
