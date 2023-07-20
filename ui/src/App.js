import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { verifyUser } from "./store/authentication/authenticationActions";
import LoginPage from "./pages/loginPage/loginPage";
import ManagerLayout from "./layout/managerLayout/managerLayout";
import DataSpecialistLayout from "./layout/dataSpecialistLayout/dataSpecialistLayout";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Alert from "./components/alertAndDialog/alertBar";
import BounceLoading from "./components/loading/bounceLoader";
function App() {
  const authData = useSelector((state) => {
    return state.auth;
  });
  const authRole = useSelector((state) => {
    return state.auth.role;
  });
  const dispatch = useDispatch();

  const [loading, SetLoading] = useState(true);

  /**
   * Check for token and login the user based on role
   */
  useEffect(() => {
    dispatch(verifyUser()).then((res) => {
      SetLoading(false);
    });
  }, []);
  /**
   * Create and customize Material UI Theme
   */
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#3751ff",
        light: "#7e7eff",
        dark: "#0028ca",
        contrastText: "#ffffff",
      },
      toolbar: {
        main: "#363740",
        text: "#A4A6B3",
        activetext: "#ffffff",
      },
      appbar: {
        text: "#252733",
      },
    },
    typography: {
      fontFamily: "Mulish",
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
  });

  /**
   * Setting route based on user role
   */
  const conditionalRoute = () => {
    if (authRole === "MANAGER") {
      return <ManagerLayout />;
    } else if (authRole === "DATA_SPECIALIST") {
      return <DataSpecialistLayout />;
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Alert />
        <ToastContainer />
        {loading ? (
          <BounceLoading />
        ) : authData.loginState ? (
          conditionalRoute()
        ) : (
          <LoginPage />
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
