import React, { useState } from "react";
import styled from "styled-components";
import Container from "../../preBuiltComponents/UI/Container";
import Box from "../../preBuiltComponents/Box";
import loginpage_image from "../../assets/images/loginpage_image.jpg";
import logo from "../../assets/images/Logo.png";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { useSelector, useDispatch } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import { loginUser } from "../../store/authentication/authenticationActions";

const LoginPage = ({ row, col1, col2 }) => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();

  const credentialError = useSelector((state) => {
    return state.auth.error;
  });
  const authLoading = useSelector((state) => {
    return state.auth.authLoading;
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setpassword(e.target.value);
  };
  const handleSubmit = () => {
    setEmailError("");
    setPasswordError("");
    if (email === "") {
      setEmailError("Please enter a valid email id");
    }
    if (password === "") {
      return setPasswordError("please enter a password");
    } else {
      dispatch(
        loginUser({
          email: email,
          password: password,
        })
      );
    }
  };
  const keyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleSubmit();
    }
  };
  return (
    <LoginPageWrapper>
      <Container fullWidth noGutter className="customcontainer">
        <Box {...row}>
          <Box {...col1} className="imageside">
            {" "}
          </Box>
          <Box {...col2}>
            <div className="formholder">
              <div className="logoholder">
                <img src={logo} alt="logo" />
              </div>
              <h1>Login</h1>
              <p className="p">Login to iGrant with your email and password.</p>
              <div>
                <TextField
                  error={emailError === "" ? false : true}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  size="small"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  fullWidth
                  helperText={emailError}
                  onKeyDown={keyDown}
                />
              </div>
              <div className="formfield">
                <TextField
                  error={passwordError === "" ? false : true}
                  id="outlined-basic"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={handlePasswordChange}
                  size="small"
                  helperText={passwordError}
                  fullWidth
                  onKeyDown={keyDown}
                />
              </div>
              <div className="formfield">
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  fullWidth
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                {authLoading ? <LinearProgress color="secondary" /> : null}
              </div>
              <div className="formfield">
                {credentialError !== null ? (
                  <p className="formerror">{credentialError}</p>
                ) : null}
              </div>
            </div>
          </Box>
        </Box>
      </Container>
    </LoginPageWrapper>
  );
};
LoginPage.defaultProps = {
  row: {
    flexBox: true,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    className: "customrow",
  },
  col1: {
    width: ["0%", "0%", "50%", "50%", "50%"],
  },
  col2: {
    width: ["100%", "100%", "50%", "50%", "50%"],
  },
};

export default LoginPage;

export const LoginPageWrapper = styled.section`
  height: 100vh;
  min-height: 400px;
  h1 {
    font-size: 48px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  .customcontainer,
  .customrow {
    height: 100%;
  }
  .imageside {
    height: 100%;
    background: url(${loginpage_image});
    background-repeat: no-repeat;
    background-size: cover;
  }
  .formholder {
    margin: 0px 60px;
    .p {
      margin-bottom: 60px;
      color: #777777;
    }
    .formfield {
      margin-top: 20px;
      text-align: center;
    }
  }
  .formerror {
    color: red;
    font-size: 14px;
    -webkit-animation: shake 1s ease-in-out 0.1s alternate;
  }
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-10deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(10deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(10deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-10deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-10deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(10deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
`;
