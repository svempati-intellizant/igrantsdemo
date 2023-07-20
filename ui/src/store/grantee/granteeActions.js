import { setAlert, resetAlert } from "../alert/alertActions";
import axiosInstance from "../../utils/axios/axios";
import { successToast, errorToast } from "../../utils/toast/toast";

export const setGranteeList = (list) => {
  // make api call to fetch grantee list
  return { type: "SET_GRANTEE_LIST", payload: list };
};
export const setProjectList = (listData) => {
  // make api call to fetch project list
  return { type: "SET_PROJECT_LIST", payload: listData };
};
export const setGrantListLoading = () => {};
export const setGrantList = (listData) => {
  return { type: "SET_GRANT_LIST", payload: listData };
};
export const setQuestionList = (list) => {
  // make api call to fetch project list
  return { type: "SET_QUESTION_LIST", payload: list };
};
export const setAllGrantData = (data) => {
  return { type: "SET_ALLGRANTS_DATA", payload: data };
};
export const setAllGrantDataLoadingState = (state) => {
  return { type: "SET_ALLGRANTS_LOADING", payload: state };
};

/**
 * Fetch all grantee List from backend
 */
export const fetchALLGranteeList = () => {
  return (dispatch) => {
    return axiosInstance
      .get("/grantee-master")
      .then((res) => {
        if (res.data) {
          console.log("Fetch grantee list action output - SUCCESS", res.data);
          dispatch(setGranteeList(res.data));
          return Promise.resolve({
            granteeList: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(
          "Fetch grantee list action output - ERROR",
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
/**
 * Fetch Single Grantee Detail from Backend
 */
export const getGranteeDetail = (granteeid) => {
  return (dispatch) => {
    return axiosInstance
      .get("/grantee-master/" + granteeid)
      .then((res) => {
        if (res.data) {
          console.log(
            "Fetch Single Grantee Detail action output - SUCCESS",
            res.data
          );
          return Promise.resolve({
            grantee: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(
          "Fetch Single Grantee Detail action output - ERROR",
          err.response.data.payload
        );
        dispatch(
          setAlert({
            alertType: "error",
            alertText: err.response.data.payload,
          })
        );
        return Promise.resolve({ error: err.response.data.payload });
      });
  };
};
/**
 * Submit Grantee Detail to Backend
 */
export const submitGranteeDetails = (body) => {
  return (dispatch) => {
    return axiosInstance
      .post("/grantee-master/create-grantee", body)
      .then((res) => {
        if (res.data) {
          console.log(
            "Submit grantee detail action output - SUCCESS",
            res.data
          );
          dispatch(
            setAlert({
              alertType: "success",
              alertText:
                "Successfully created a new grantee with grantee name " +
                res.data.grantee_name,
            })
          );
          return Promise.resolve({
            id: res.data._id,
            name: res.data.grantee_name,
          });
        }
      })
      .catch((err) => {
        console.log(
          "Submit grantee detail action output - ERROR",
          err.response.data.payload
        );
        dispatch(
          setAlert({
            alertType: "error",
            alertText: err.response.data.payload,
          })
        );
        return Promise.resolve({ error: err.response.data.payload });
      });
  };
};

/**
 * Submit create grant to backend
 */
export const createGrant = (body) => {
  return (dispatch) => {
    return axiosInstance
      .post("/grant-master/create-grant", body)
      .then((res) => {
        if (res.data) {
          console.log("Submit create grant action output - SUCCESS", res.data);
          dispatch(
            setAlert({
              alertType: "success",
              alertText: "Successfully created a new grant",
            })
          );
          return Promise.resolve({
            id: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(
          "Submit create grant action output - ERROR",
          err.response.data.payload
        );
        dispatch(
          setAlert({
            alertType: "error",
            alertText: err.response.data.payload,
          })
        );
        return Promise.resolve({ error: err.response.data.payload });
      });
  };
};

/**
 * Fetch All Grant list
 */
export const fetchallGrantList = () => {
  return (dispatch) => {
    dispatch(setAllGrantDataLoadingState(true));
    return axiosInstance
      .get("/grant-master/get-all-grant")
      .then((res) => {
        dispatch(setAllGrantData(res.data));
        dispatch(setAllGrantDataLoadingState(false));
        console.log("Fetch All Grant list action output -SUCCESS", res.data);
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        dispatch(setAllGrantDataLoadingState(false));
        console.log(
          "Fetch All Grant list action output -ERROR",
          err.response.data.payload
        );
        dispatch(
          setAlert({
            alertType: "error",
            alertText: err.response.data.payload,
          })
        );
        return Promise.reject(err.response.data.payload);
      });
  };
};
/**
 * Fetch Grant List By Grantee ID
 */
export const fetchGrantListById = (granteeId) => {
  return (dispatch) => {
    return axiosInstance
      .get("/grantee-grant/" + granteeId)
      .then((res) => {
        if (res) {
          console.log(
            "Fetch Grant List By Grantee ID action output - SUCCESS",
            res.data
          );
          dispatch(
            setProjectList({
              granteeId: granteeId,
              grants: res.data,
              tableData: res.data,
            })
          );
          return Promise.resolve({
            grantList: res.data,
            tableData: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(
          "Fetch Grant List By Grantee ID action output - ERROR",
          err.response.data.payload
        );
        dispatch(
          setProjectList({
            granteeId: granteeId,
            grants: [],
            tableData: [],
          })
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

/**
 * Fetch Question List By Grantee ID
 */
export const fetchQuestionsSet = (granteeProjectId) => {
  return (dispatch) => {
    return axiosInstance
      .get("/question-master/" + granteeProjectId)
      .then((res) => {
        console.log(
          "Fetch Question List By Grantee ID action output - SUCCESS",
          res
        );
        dispatch(
          setQuestionList({
            granteeProjectId: granteeProjectId,
            questions: res.data,
          })
        );
        return Promise.resolve({
          questions: res.data,
        });
      })
      .catch((err) => {
        console.log(
          "Fetch Question List By Grantee ID action output - ERROR",
          err.response.data.payload
        );
        dispatch(
          setQuestionList({
            granteeProjectId: null,
            questions: [],
          })
        );
        return Promise.reject({ error: err.response.data.payload });
      });
  };
};

/**
 * Submit Risk Answers
 */
export const submitRiskAnswers = (body) => {
  return (dispatch) => {
    return axiosInstance
      .post("/answer", body)
      .then((res) => {
        console.log("Submit Risk Answers action output - SUCCESS", res);
        successToast("Action successful", "OK");
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log(
          "Submit Risk Answers action output - ERROR",
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

/**
 * Submit Renew Grant Details
 */
export const submitRenewGrant = (body) => {
  return (dispatch) => {
    return axiosInstance
      .post("/grantee-grant/renew-grant/", body)
      .then((res) => {
        console.log("Submit Renew Grant Details action output - SUCCESS", res);
        successToast("Submission successful", "OK");
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log(
          "Submit Renew Grant Details action output - ERROR",
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

/**
 * Submit Single Audit File
 */
export const submitSingleAuditFile = (body) => {
  return (dispatch) => {
    const formdata = new FormData();
    formdata.append("file", body);
    return axiosInstance
      .post("/audit/audit-upload", formdata)
      .then((res) => {
        console.log("Submit Single Audit File action output - Success ", res);
        dispatch(
          setAlert({
            alertType: "success",
            alertText: "Successfully submited Single Audit file",
          })
        );
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("Submit Single Audit File action output - Success ", err);
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
