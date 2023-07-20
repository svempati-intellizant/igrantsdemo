import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import {
  setLocation,
  setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConfirmationDialog from "../../components/alertAndDialog/confirmationDialog";
import { CustomTextField } from "../../components/inputField/customTextField";
import Button from "@material-ui/core/Button";

import { submitGranteeDetails } from "../../store/grantee/granteeActions";
import { dataSpecialistRouteLinks } from "../../router/linkMaster";
/**
 * style components with material ui makestyles
 */
const useStyles = makeStyles((theme) => ({
  growFull: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "transparent",
    color: theme.palette.appbar.text,
    borderBottom: "1px solid #b7b7af",
    padding: "10px 0px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  button: {
    marginLeft: "10px",
  },
}));

/**
 * ==================================================
 * ==== DATA SPECIALIST ADD NEW GRANTEE COMPONENT ===
 * ==================================================
 */
const DataSpecialistAddNewGrantee = () => {
  let { path, url } = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Add new Grantee"));
  }, []);
  /**
   * Question array
   */
  const questionset = [
    {
      no: 1,
      question: "Name of the institution",
      placeholder: "Name of the institution",
      targetName: "name_of_institution",
    },
    {
      no: 2,
      question: "Employer Identification Number",
      placeholder: "Enter the Employer's Identification Number",
      targetName: "ein",
    },
    {
      no: 3,
      question: "Name of the Grantee",
      placeholder: "Enter the name of the grantee",
      targetName: "grantee_name",
    },
    {
      no: 4,
      question: "Grantee's business domain",
      placeholder: "Grantee's business domain",
      targetName: "occupation",
    },
    {
      no: 5,
      question: "Address of the Grantee",
      placeholder: "Address of the Grantee",
      targetName: "address",
    },
    {
      no: 6,
      question: "Grantee's contact details",
      placeholder: "phone number / email-id",
      targetName: "contact_details",
    },
  ];
  const [submitData, setSubmitDAta] = useState({
    grantee_name: "",
    occupation: "",
    name_of_institution: "",
    address: "",
    contact_details: "",
    ein: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [granteeDetail, setGranteeDetail] = useState({
    showDialog: false,
    granteeName: null,
    granteeId: null,
  });

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setSubmitDAta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler = () => {
    setConfirmation(true);
  };

  const confirmationHadler = () => {
    setLoadingSubmit(true);
    dispatch(submitGranteeDetails(submitData)).then((res) => {
      setLoadingSubmit(false);
      setConfirmation(false);
      if (res.id) {
        setGranteeDetail({
          ...granteeDetail,
          granteeId: res.id,
          granteeName: res.name,
        });
      }
    });
  };
  const redirectHandler = () => {
    return history.push(
      `${dataSpecialistRouteLinks.grantList.baseUrl}/${granteeDetail.granteeId}`
    );
  };
  const cancelRedirect = () => {
    setGranteeDetail({
      showDialog: false,
      granteeName: null,
      granteeId: null,
    });
  };
  return (
    <DataSpecialistAddNewGranteeWrapper>
      <Paper className="customPaper" elevation={0}>
        <AppBar position="static" className={classes.appBar} elevation={0}>
          <Toolbar variant="dense">
            <Typography
              variant="h6"
              color="inherit"
              className={classes.growFull}
            >
              Please Fill the Grantee details
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={submitHandler}
              disableElevation
            >
              Submit
            </Button>
            {granteeDetail.granteeId ? (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => {
                  setGranteeDetail({
                    ...granteeDetail,
                    showDialog: true,
                  });
                }}
                disableElevation
                className={classes.button}
              >
                Create Grant for {granteeDetail.granteeName}
              </Button>
            ) : null}
          </Toolbar>
        </AppBar>

        <div className="QuestionAnswerArea">
          <form noValidate autoComplete="off">
            {/* Questions*/}
            {questionset.map((x, i) => {
              return (
                <Grid container spacing={3} alignItems="center" key={i}>
                  <Grid item xs={12} md={4}>
                    <p className="question">
                      {x.no}. {x.question}
                    </p>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CustomTextField
                      variant="outlined"
                      placeholder={x.placeholder}
                      fullWidth
                      name={x.targetName}
                      onChange={inputChangeHandler}
                      size="small"
                    />
                  </Grid>
                </Grid>
              );
            })}
          </form>
        </div>
        <Backdrop className={classes.backdrop} open={loadingSubmit}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* confirmation for submit */}
        <ConfirmationDialog
          dialogShow={confirmation}
          title="Do you sure want to submit ?"
          content="Are you sure want to submit. Once submitted can not be changed"
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          primaryButtonHandler={confirmationHadler}
          secondaryButtonHandler={() => {
            setConfirmation(false);
          }}
        />
        {/* confirmation for go to project */}
        <ConfirmationDialog
          dialogShow={granteeDetail.showDialog}
          title={`Create Grant for ${granteeDetail.granteeName}`}
          content={`On confirm You will be taken to the Grant list view of ${granteeDetail.granteeName} where you can create new grant.`}
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          primaryButtonHandler={redirectHandler}
          secondaryButtonHandler={() => {
            cancelRedirect();
          }}
        />
      </Paper>
    </DataSpecialistAddNewGranteeWrapper>
  );
};

export default DataSpecialistAddNewGrantee;

export const DataSpecialistAddNewGranteeWrapper = styled.section`
  .QuestionAnswerArea {
    margin: 20px 20px;
  }
  .questionset {
    margin: 20px 0px;
  }
  .question {
    font-size: 18px;
    color: #5f6377;
  }
`;
