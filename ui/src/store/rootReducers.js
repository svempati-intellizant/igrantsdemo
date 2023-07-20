import { combineReducers } from "redux";
import { authenticationReducer } from "./authentication/authenticationReducer";
import { drawerPropertyReducer } from "./drawerProperty/drawerPropertyReducer";
import { alertReducer } from "./alert/alertReducer";
import { granteeReducer } from "./grantee/granteeReducer";
import { agencyReducer } from "./agency/agencyReducer";
const rootReducer = combineReducers({
  auth: authenticationReducer,
  drawer: drawerPropertyReducer,
  alert: alertReducer,
  grantee: granteeReducer,
  agency: agencyReducer,
});

export default rootReducer;
