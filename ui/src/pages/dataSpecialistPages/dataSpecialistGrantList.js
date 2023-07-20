/**
 * node module import
 */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import { useTheme } from "@material-ui/core/styles";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CancelIcon from "@material-ui/icons/Cancel";
/**
 * Custom component imports
 */
import CustomTable from "../../components/customTable/customTable";
import ConfirmationDialog from "../../components/alertAndDialog/confirmationDialog";
import { CustomTextField } from "../../components/inputField/customTextField";
/**
 * Redux action imports
 */
import {
  setLocation,
  setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import {
  getGranteeDetail,
  createGrant,
  fetchGrantListById,
} from "../../store/grantee/granteeActions";

/**
 * function imports
 */
import { dataSpecialistRouteLinks } from "../../router/linkMaster";

/**
 * Styles using material ui makestyles
 */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function DataSpecialistSingleGrantList() {
  // setup hooks
  const { granteeId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();

  // Use State hooks
  const [currentGranteeDetail, setCurrentGranteeDetail] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [accordian, setAccordian] = useState(false);
  const [toSend, setToSend] = useState({
    agency: "",
    grant_name: "",
    grant_id: "",
    grant_authorized: "",
    grant_from_date: "",
    grant_to_date: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // get state from redux
  const grantList = useSelector((state) => {
    return state.grantee.grantList.grants;
  });

  // Mount lifecycle hook
  useEffect(() => {
    dispatch(setLocation("grant-list"));
    dispatch(setTitle("Grant List"));
    dispatch(getGranteeDetail(granteeId)).then((res) => {
      if (res.error) {
        history.push(dataSpecialistRouteLinks.dashboard);
      } else {
        setCurrentGranteeDetail(res.grantee);
      }
    });
  }, []);
  // Watch for changes in currentGrantee and dispatch redux
  useEffect(() => {
    setTableLoading(true);
    dispatch(fetchGrantListById(granteeId))
      .then((res) => {
        setTableLoading(false);
      })
      .catch((err) => {
        setTableLoading(false);
      });
  }, [currentGranteeDetail]);

  // Handle Accordian Toggle
  const handleAccordianChange = () => {
    setAccordian((prevState) => !prevState);
  };
  // Question set for creating grantlist
  const CreateGrantQuestion = [
    {
      question: "Grant Id",
      placeholder: "Grant's UniqueId eg:8L97IR76985-13",
      fieldtarget: "grant_id",
      type: "text",
    },
    {
      question: "Grant Applied for",
      placeholder: "Please Enter the name of the grant, requested for",
      fieldtarget: "grant_name",
      type: "text",
    },
    {
      question: "Agency Name",
      placeholder: "Please Enter the name of the Agency",
      fieldtarget: "agency",
      type: "text",
    },
    {
      question: "Grant Amount requested",
      placeholder: "Please Enter the grant amount requested",
      fieldtarget: "grant_authorized",
      type: "number",
    },
    {
      question: "Grant start date",
      placeholder: "When will the grant cycle start",
      fieldtarget: "grant_from_date",
      type: "date",
    },
    {
      question: "Grant end date",
      placeholder: "When will the grant cycle end",
      fieldtarget: "grant_to_date",
      type: "date",
    },
  ];
  // Function triggered on click of add grant
  const addButtonclickHandler = () => {
    setShowDialog(true);
  };

  // Function that control confirmation dialog box ---- ACCEPT----
  const confirmNewGrantSubmit = () => {
    setShowDialog(false);
    setSubmitLoading(true);
    dispatch(
      createGrant({
        ...toSend,
        grant_from_date: new Date(toSend.grant_from_date).toISOString(),
        grant_to_date: new Date(toSend.grant_to_date).toISOString(),
        grantee_master_id: currentGranteeDetail._id,
      })
    )
      .then((res) => {
        setSubmitLoading(false);
        dispatch(fetchGrantListById(granteeId));
        setToSend({
          grant_name: "",
          grant_id: "",
          grant_authorized: "",
          grant_from_date: "",
          grant_to_date: "",
        });
      })
      .catch((err) => {
        setSubmitLoading(false);
      });
  };
  // Function that control confirmation dialog box ---- CANCEL----
  const cancelNewGrantSubmit = () => {
    setShowDialog(false);
    setToSend({
      grant_name: "",
      grant_id: "",
      grant_authorized: "",
      grant_from_date: "",
      grant_to_date: "",
    });
  };

  // Function to control CLick of Table Item
  const iconClickHandler = (projectMasterId) => {
    history.push(
      `${dataSpecialistRouteLinks.grantDetail.baseUrl}/${granteeId}/questions/${projectMasterId}`
    );
  };

  const renewGrantHandler = (projectMasterId) => {
    history.push(
      `${dataSpecialistRouteLinks.grantDetail.baseUrl}/${granteeId}/renew/${projectMasterId}`
    );
  };

  const inputhandler = (e) => {
    const { name, value } = e.target;
    setToSend((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  // Table headers
  const headCells = [
    {
      id: "grantId",
      disablePadding: true,
      label: "Grant Id",
      sortable: true,
      searchable: true,
    },
    {
      id: "nameOfGrant",
      disablePadding: true,
      label: "Name of Grant",
      sortable: true,
      searchable: true,
      limit: 30,
    },
    {
      id: "modifiedAt",
      disablePadding: true,
      label: "Grant Applied Date",
      sortable: true,
      searchable: true,
    },
    {
      id: "grantValue",
      disablePadding: true,
      label: "Grant Value",
      sortable: true,
      searchable: true,
    },
    {
      id: "reviewGrant",
      disablePadding: false,
      label: "Risk Assesment",
      sortable: false,
      searchable: false,
    },
    {
      id: "RenewGrantDetails",
      disablePadding: false,
      label: "Renew Grant",
      sortable: false,
      searchable: false,
    },
  ];

  var rows = () => {
    if (grantList.length > 0) {
      return grantList.map((x, i) => ({
        uid: x._id,
        grantId: x.grant_master_id.grant_id,
        nameOfGrant: x.grant_master_id.grant_name,
        modifiedAt:
          new Date(x.updatedAt).getMonth() +
          1 +
          "/" +
          (new Date(x.updatedAt).getDate() +
            "/" +
            new Date(x.updatedAt).getFullYear()),
        grantValue: x.grant_master_id.grant_authorized,
        reviewGrant: (
          <IconButton
            style={{ color: theme.palette.primary.dark }}
            onClick={() => {
              iconClickHandler(x._id);
            }}
          >
            <SubdirectoryArrowRightIcon />
          </IconButton>
        ),

        RenewGrantDetails: (
          <IconButton
            style={{ color: theme.palette.primary.dark }}
            onClick={() => {
              renewGrantHandler(x._id);
            }}
          >
            <AutorenewIcon />
          </IconButton>
        ),
      }));
    } else return [];
  };

  return (
    <DataSpecialistSingleGrantListWrapper>
      {/* ---------------------------------------------------------
      ---------------------  ACCORDIAN COMPONENT ------------------
      -------------------------------------------------------------
       */}
      <div className="accordianHolder">
        <Accordion
          TransitionProps={{
            timeout: {
              appear: 0,
              enter: 0,
              exit: 0,
            },
          }}
          expanded={accordian}
          onChange={handleAccordianChange}
        >
          <AccordionSummary
            expandIcon={
              <IconButton aria-label="delete" color="primary">
                {accordian ? <CancelIcon /> : <AddCircleIcon />}
              </IconButton>
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Add New Grant for{" "}
              {currentGranteeDetail ? currentGranteeDetail.grantee_name : null}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ width: "100%" }}>
              {CreateGrantQuestion.map((question, i) => {
                return (
                  <Grid container spacing={3} alignItems="center" key={i}>
                    <Grid item xs={12} md={2}>
                      <p className="question">{question.question}</p>
                    </Grid>
                    <Grid item xs={11} md={8}>
                      <CustomTextField
                        variant="outlined"
                        placeholder={question.placeholder}
                        fullWidth
                        name={question.fieldtarget}
                        size="small"
                        onChange={inputhandler}
                        value={toSend[question.fieldtarget]}
                        type={question.type}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      md={2}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {i === CreateGrantQuestion.length - 1 ? (
                        <Button
                          variant="text"
                          color="primary"
                          onClick={addButtonclickHandler}
                        >
                          Submit
                        </Button>
                      ) : null}
                    </Grid>
                  </Grid>
                );
              })}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      {/* ---------------------------------------------------------
      ---------------------  CUSTOM TABLE COMPONENT ------------------
      -------------------------------------------------------------
       */}
      <div className="ProjectListTable">
        {tableLoading ? (
          <div className="noTableData">
            <h1>Loading Table ..</h1>
          </div>
        ) : rows().length > 0 ? (
          <CustomTable
            rows={rows()}
            headCells={headCells}
            title="Grant History"
            showSelect={false}
          />
        ) : (
          <div className="noTableData">
            <h1>No Grant Details Found ..</h1>
          </div>
        )}
      </div>

      {/* Confirmation handler for submission */}
      <ConfirmationDialog
        dialogShow={showDialog}
        title={`Create a new Grant for ${
          currentGranteeDetail ? currentGranteeDetail.grantee_name : null
        }`}
        content={`On confirm You will create a new grant for ${
          currentGranteeDetail ? currentGranteeDetail.grantee_name : null
        }`}
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        primaryButtonHandler={confirmNewGrantSubmit}
        secondaryButtonHandler={cancelNewGrantSubmit}
      />
      {/* Loading Display */}
      <Backdrop className={classes.backdrop} open={submitLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </DataSpecialistSingleGrantListWrapper>
  );
}

export default DataSpecialistSingleGrantList;

const DataSpecialistSingleGrantListWrapper = styled.section`
  .MuiAccordionSummary-expandIcon.Mui-expanded {
    transform: rotate(0deg) !important;
  }
  .ProjectListTable {
    margin-top: 100px;
  }
`;
