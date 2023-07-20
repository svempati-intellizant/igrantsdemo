/**
 * node module import
 */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CustomTextField } from "../../components/inputField/customTextField";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";
/**
 * Redux action imports
 */
import {
  setLocation,
  setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import {
  fetchQuestionsSet,
  fetchGrantListById,
  submitRiskAnswers,
} from "../../store/grantee/granteeActions";
import { TvRounded } from "@material-ui/icons";

import ConfirmationDialog from "../../components/alertAndDialog/confirmationDialog";

/**
 * =======================================================
 * --------------- TAB PANEL MATERIAL UI -----------------
 * =======================================================
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  radioOptionLabel: {
    fontSize: "12px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

/**
 * =======================================================
 * ---------------- FORM DATA GENERATOR ------------------
 * =======================================================
 */

const formDataGenerator = (formdata, answers) => {
  const formDataToSend = new FormData();
  let questionAttachment = [];
  for (let i = 0; i < formdata.length; i++) {
    questionAttachment.push({
      questionId: formdata[i].questionId,
      file_name: formdata[i].file["name"],
    });

    formDataToSend.append("files[]", formdata[i].file);
  }
  formDataToSend.append(
    "data",
    JSON.stringify({ answers, questionAttachment })
  );
  return formDataToSend;
};
/**
 * =======================================================
 * -------- DATA SPECIALIST GRANT DETAIL PAGE ------------
 * =======================================================
 */
function DataSpecialistGrantDetail() {
  // setup hooks
  const { granteeId, granteeGrantId } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // State management hook
  const [value, setValue] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [dialogShow, setDialogShow] = useState(false);
  const [fileUpload, setFileupload] = useState([]);
  const [grantName, setGrantName] = useState("");
  // Mount lifecycle hook
  useEffect(() => {
    dispatch(setLocation("grant-detail"));
    dispatch(fetchGrantListById(granteeId))
      .then((res) => {
        dispatch(setTitle("Grant Assesment"));
        setGrantName(
          res.grantList.filter((x) => x._id === granteeGrantId)[0]
            .grant_master_id.grant_name
        );
      })
      .catch((err) => {
        return null;
      });
    dispatch(fetchQuestionsSet(granteeGrantId))
      .then((res) => {
        const toSet = () =>
          res.questions.map((x) => {
            if (x.answer) {
              return {
                ...x,
                answertoSubmit: {
                  question_id: x._id,
                  answer_chosen: {
                    value: x.answer.value,
                    weightage: x.answer.weightage,
                    question_impact_values: x.question_impact_values,
                    probability: x.probability,
                    description: x.answer.description,
                  },
                },
              };
            } else {
              return {
                ...x,
                answertoSubmit: {
                  question_id: x._id,
                  answer_chosen: {
                    value: null,
                    weightage: null,
                    question_impact_values: x.question_impact_values,
                    probability: x.probability,
                    description: "",
                  },
                },
              };
            }
          });
        setQuestions(toSet());
        setQuestionLoading(false);
      })
      .catch((err) => {});
  }, []);

  // Handle tab changes
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handle Answer Change
  const handleAnswerChange = (e) => {
    const newSet = questions.map((x) =>
      x._id === e.target.name
        ? {
            ...x,
            answertoSubmit: {
              question_id: x._id,
              answer_chosen: {
                value: e.target.value,
                weightage: x.answer_impact_values.filter(
                  (op) => op.value === e.target.value
                )[0].weightage,
                question_impact_values:
                  x.answertoSubmit.answer_chosen.question_impact_values,
                probability: x.answertoSubmit.answer_chosen.probability,
              },
            },
          }
        : x
    );
    setQuestions(newSet);
  };

  //  Handle TextBox answer changes
  const handleTextBoxChanges = (e) => {
    const newSet = questions.map((x) =>
      x._id === e.target.name
        ? {
            ...x,
            answertoSubmit: {
              ...x.answertoSubmit,
              answer_chosen: {
                ...x.answertoSubmit.answer_chosen,
                description: e.target.value,
              },
            },
          }
        : x
    );
    setQuestions(newSet);
  };

  // Handle File changes handler
  const fileuploadHandler = (e) => {
    setFileupload((prevState) => {
      const targetRemoved = prevState.filter(
        (x) => x.questionId != e.target.name
      );
      return [
        ...targetRemoved,
        { questionId: e.target.name, file: e.target.files[0] },
      ];
    });
  };
  // Function to Handle Save Answers
  const handleSaveAnswers = () => {
    setSaveLoading(true);
    const answersToSubmit = questions
      .filter((x) => (x ? x.answertoSubmit.answer_chosen.value != null : null))
      .map((items) => items.answertoSubmit);
    const populatedData = {
      grantee_grant_id: granteeGrantId,
      is_submit: false,
      answer: answersToSubmit,
    };
    const send = formDataGenerator(fileUpload, populatedData);
    dispatch(submitRiskAnswers(send))
      .then((res) => {
        setSaveLoading(false);
      })
      .catch((err) => {
        setSaveLoading(false);
      });
  };

  // Function to Handle Submit Answers
  const handleSubmitAnswers = () => {
    setDialogShow(false);
    setSubmitLoading(true);
    const answersToSubmit = questions
      .filter((x) => (x ? x.answertoSubmit.answer_chosen.value != null : null))
      .map((items) => items.answertoSubmit);
    const poulatedData = {
      grantee_grant_id: granteeGrantId,
      is_submit: true,
      answer: answersToSubmit,
    };
    const send = formDataGenerator(fileUpload, poulatedData);
    dispatch(submitRiskAnswers(send))
      .then((res) => {
        setSubmitLoading(false);
        history.go(-1);
      })
      .catch((err) => {
        setSubmitLoading(false);
      });
  };
  // Function to Handle Cancel Submit Answers
  const handleCancelSubmitAnswers = () => {
    setDialogShow(false);
  };

  return (
    <DataSpecialistGrantDetailWrapper>
      <div className="TitleWrapper">
        <h1>{grantName}</h1>
      </div>
      {questionLoading ? (
        <div className="noQuestionData">
          <h1>Loading Questions ..</h1>
        </div>
      ) : (
        <div className={classes.root}>
          {/**
           * ------------------------------------------------------------
           * -------------------------- TAB BAR -------------------------
           * ------------------------------------------------------------
           */}
          <AppBar position="static" color="default">
            <Toolbar>
              <div className="customFlexDisplay">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="Performance Risk" {...a11yProps(0)} />
                  <Tab label="Financial Risk" {...a11yProps(1)} />
                  <Tab label="Quality Risk" {...a11yProps(2)} />
                  <Tab label="Management Risk" {...a11yProps(3)} />
                </Tabs>
                <div className="appBarButtonHolder">
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    onClick={handleSaveAnswers}
                    disabled={saveLoading}
                  >
                    Save
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      setDialogShow(true);
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          {/**
           * ------------------------------------------------------------
           * -------------------- PERFORMANCE RISK TAB ------------------
           * ------------------------------------------------------------
           */}
          <TabPanel value={value} index={0} className="customTabPanel">
            {questions
              .filter((x) => x.risk_type === "Performance Risk")
              .map((question, i) => {
                if (question.question_type === "radio") {
                  return (
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      key={i}
                      className="customGridClass"
                    >
                      <Grid item xs={12} md={7}>
                        {/* {question.sequence_no}. {question.question} */}
                        {question.question}
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <RadioGroup
                          row
                          aria-label="position"
                          name={question._id}
                          defaultValue="top"
                          value={question.answertoSubmit.answer_chosen.value}
                          onChange={handleAnswerChange}
                        >
                          <div className="customOptionHolder">
                            {question.answer_impact_values.map((options, i) => {
                              return (
                                <FormControlLabel
                                  value={options.value}
                                  control={
                                    <Radio color="primary" size="small" />
                                  }
                                  label={options.value}
                                  labelPlacement="top"
                                  classes={{
                                    label: classes.radioOptionLabel,
                                  }}
                                  key={i}
                                />
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          placeholder="Enter supporting text if required"
                          value={
                            question.answertoSubmit.answer_chosen.description
                          }
                          name={question._id}
                          onChange={handleTextBoxChanges}
                          disabled={
                            question.answertoSubmit.answer_chosen.value
                              ? false
                              : true
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", textAlign: "center" }}
                      >
                        <input
                          accept="image/*"
                          id={"fileupload" + question._id}
                          name={question._id}
                          multiple
                          type="file"
                          onChange={fileuploadHandler}
                        />
                      </Grid>
                    </Grid>
                  );
                } else {
                  return null;
                }
              })}
          </TabPanel>
          {/**
           * ------------------------------------------------------------
           * -------------------- FINANCIAL RISK TAB ------------------
           * ------------------------------------------------------------
           */}
          <TabPanel value={value} index={1} className="customTabPanel">
            {questions
              .filter((x) => x.risk_type === "Financial Risk")
              .map((question, i) => {
                if (question.question_type === "radio") {
                  return (
                    <Grid
                      container
                      spacing={3}
                      alignItems="center"
                      key={i}
                      className="customGridClass"
                    >
                      <Grid item xs={12} md={9}>
                        {/* {question.sequence_no}. {question.question} */}
                        {question.question}
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <RadioGroup
                          row
                          aria-label="position"
                          name={question._id}
                          defaultValue="top"
                          value={question.answertoSubmit.answer_chosen.value}
                          onChange={handleAnswerChange}
                        >
                          <div className="customOptionHolder">
                            {question.answer_impact_values.map((options, i) => {
                              return (
                                <FormControlLabel
                                  value={options.value}
                                  control={
                                    <Radio color="primary" size="small" />
                                  }
                                  label={options.value}
                                  labelPlacement="top"
                                  classes={{
                                    label: classes.radioOptionLabel,
                                  }}
                                  key={i}
                                />
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} md={8} style={{ marginTop: "15px" }}>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          placeholder="Enter supporting text if required"
                          value={
                            question.answertoSubmit.answer_chosen.description
                          }
                          name={question._id}
                          onChange={handleTextBoxChanges}
                          disabled={
                            question.answertoSubmit.answer_chosen.value
                              ? false
                              : true
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        style={{ marginTop: "15px", textAlign: "center" }}
                      >
                        <input
                          accept="image/*"
                          id={"fileupload" + question._id}
                          name={question._id}
                          multiple
                          type="file"
                          onChange={fileuploadHandler}
                        />
                      </Grid>
                    </Grid>
                  );
                } else {
                  return null;
                }
              })}
          </TabPanel>
          {/**
           * ------------------------------------------------------------
           * ---------------------- QUALITY RISK TAB --------------------
           * ------------------------------------------------------------
           */}
          <TabPanel value={value} index={2} className="customTabPanel">
            {questions
              .filter((x) => x.risk_type === "Quality Risk")
              .map((question, i) => {
                if (question.question_type === "radio") {
                  return (
                    <Grid
                      container
                      spacing={3}
                      alignItems="center"
                      key={i}
                      className="customGridClass"
                    >
                      <Grid item xs={12} md={9}>
                        {/* {question.sequence_no}. {question.question} */}
                        {question.question}
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <RadioGroup
                          row
                          aria-label="position"
                          name={question._id}
                          defaultValue="top"
                          value={question.answertoSubmit.answer_chosen.value}
                          onChange={handleAnswerChange}
                        >
                          <div className="customOptionHolder">
                            {question.answer_impact_values.map((options, i) => {
                              return (
                                <FormControlLabel
                                  value={options.value}
                                  control={
                                    <Radio color="primary" size="small" />
                                  }
                                  label={options.value}
                                  labelPlacement="top"
                                  classes={{
                                    label: classes.radioOptionLabel,
                                  }}
                                  key={i}
                                />
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} md={8} style={{ marginTop: "15px" }}>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          placeholder="Enter supporting text if required"
                          value={
                            question.answertoSubmit.answer_chosen.description
                          }
                          name={question._id}
                          onChange={handleTextBoxChanges}
                          disabled={
                            question.answertoSubmit.answer_chosen.value
                              ? false
                              : true
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        style={{ marginTop: "15px", textAlign: "center" }}
                      >
                        <input
                          accept="image/*"
                          id={"fileupload" + question._id}
                          name={question._id}
                          multiple
                          type="file"
                          onChange={fileuploadHandler}
                        />
                      </Grid>
                    </Grid>
                  );
                } else {
                  return null;
                }
              })}
          </TabPanel>
          {/**
           * ------------------------------------------------------------
           * -------------------- MANAGEMENT RISK TAB ------------------
           * ------------------------------------------------------------
           */}
          <TabPanel value={value} index={3} className="customTabPanel">
            {questions
              .filter((x) => x.risk_type === "Complaince Risk")
              .map((question, i) => {
                if (question.question_type === "radio") {
                  return (
                    <Grid
                      container
                      spacing={3}
                      alignItems="center"
                      key={i}
                      className="customGridClass"
                    >
                      <Grid item xs={12} md={9}>
                        {/* {question.sequence_no}. {question.question} */}
                        {question.question}
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <RadioGroup
                          row
                          aria-label="position"
                          name={question._id}
                          defaultValue="top"
                          value={question.answertoSubmit.answer_chosen.value}
                          onChange={handleAnswerChange}
                        >
                          <div className="customOptionHolder">
                            {question.answer_impact_values.map((options, i) => {
                              return (
                                <FormControlLabel
                                  value={options.value}
                                  control={
                                    <Radio color="primary" size="small" />
                                  }
                                  label={options.value}
                                  labelPlacement="top"
                                  classes={{
                                    label: classes.radioOptionLabel,
                                  }}
                                  key={i}
                                />
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} md={8} style={{ marginTop: "15px" }}>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          placeholder="Enter supporting text if required"
                          value={
                            question.answertoSubmit.answer_chosen.description
                          }
                          name={question._id}
                          onChange={handleTextBoxChanges}
                          disabled={
                            question.answertoSubmit.answer_chosen.value
                              ? false
                              : true
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        style={{ marginTop: "15px", textAlign: "center" }}
                      >
                        <input
                          accept="image/*"
                          id={"fileupload" + question._id}
                          name={question._id}
                          multiple
                          type="file"
                          onChange={fileuploadHandler}
                        />
                      </Grid>
                    </Grid>
                  );
                } else {
                  return null;
                }
              })}
          </TabPanel>
        </div>
      )}

      {/* Loading Display */}
      <Backdrop className={classes.backdrop} open={submitLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* confirmation for submit */}
      <ConfirmationDialog
        dialogShow={dialogShow}
        title="Are you sure want to submit the assesment ?"
        content="Are you sure want to submit the risk assesment questions' answers"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        primaryButtonHandler={handleSubmitAnswers}
        secondaryButtonHandler={handleCancelSubmitAnswers}
      />
    </DataSpecialistGrantDetailWrapper>
  );
}

export default DataSpecialistGrantDetail;

const DataSpecialistGrantDetailWrapper = styled.section`
  .customFlexDisplay {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .customTabPanel {
    margin-top: 20px;
    font-size: 15px;
  }
  .customGridClass {
    padding: 30px 8px;
    &:nth-of-type(odd) {
      background-color: #d9d9d9;
    }
    &:nth-of-type(even) {
      background-color: #f4f3f3;
    }
  }
  .customOptionHolder {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  .appBarButtonHolder {
    display: flex;
  }
  .TitleWrapper {
    color: #727272;
  }
`;
