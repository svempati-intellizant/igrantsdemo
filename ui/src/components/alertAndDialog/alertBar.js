import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";
import { resetAlert } from "../../store/alert/alertActions";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "0px",
    zIndex: "110000",
    width: "60%",
    left: "20%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      left: "0%",
    },
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function TransitionAlerts() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const alertState = useSelector((state) => {
    return state.alert;
  });

  return (
    <div className={classes.root}>
      <Collapse in={alertState.show}>
        <Alert
          severity={alertState.alertType}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(resetAlert());
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertState.alertText}
        </Alert>
      </Collapse>
    </div>
  );
}
