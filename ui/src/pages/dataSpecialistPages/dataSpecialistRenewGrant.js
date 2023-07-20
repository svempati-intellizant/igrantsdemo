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
import { useTheme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
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
  fetchGrantListById,
  submitRenewGrant,
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

function DataSpecialistRenewGrant() {
  // setup hooks
  const { granteeId, granteeGrantId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();

  // Use State hooks
  const [currentGranteeDetail, setCurrentGranteeDetail] = useState(null);
  const [currentGrantDetail, setCurrentGrantDetail] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [renewGrantValue, setRenewGrantValue] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [reRender, setRerender] = useState(0);
  const [accordian, setAccordian] = useState(false);

  // Mount lifecycle hook
  useEffect(() => {
    dispatch(setLocation("renew-grant"));
    dispatch(setTitle("Renew Grant"));
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
      .then(({ grantList }) => {
        setCurrentGrantDetail(
          grantList.filter((x) => x._id === granteeGrantId)[0]
        );
        setTableLoading(false);
      })
      .catch((err) => {
        setTableLoading(false);
      });
  }, [currentGranteeDetail, reRender]);

  // Function triggered on click of add grant
  const addButtonclickHandler = () => {
    setShowDialog(true);
  };
  // Handle Accordian Toggle
  const handleAccordianChange = () => {
    setAccordian((prevState) => !prevState);
  };
  // Function that control confirmation dialog box ---- ACCEPT----
  const confirmRenewGrantSubmit = () => {
    setShowDialog(false);
    setSubmitLoading(true);
    dispatch(
      submitRenewGrant({
        grantee_grant_id: granteeGrantId,
        renewal_details: {
          renewal_fund: renewGrantValue,
        },
      })
    )
      .then((res) => {
        setSubmitLoading(false);
        dispatch(fetchGrantListById(granteeId));
        setRenewGrantValue("");
        setRerender(reRender + 1);
      })
      .catch((err) => {
        setSubmitLoading(false);
      });
  };
  // Function that control confirmation dialog box ---- CANCEL----
  const cancelRenewGrantSubmit = () => {
    setShowDialog(false);
    setRenewGrantValue("");
  };

  // Table headers
  const headCells = [
    {
      id: "RenewalAppliedDate",
      disablePadding: true,
      label: "Renewal request date",
      sortable: true,
      searchable: true,
    },
    {
      id: "RenewalAmount",
      disablePadding: true,
      label: "Grant Requested Value",
      sortable: true,
      searchable: true,
    },
    {
      id: "RenewalStatus",
      disablePadding: false,
      label: "Renewal Status",
      sortable: false,
      searchable: false,
    },
  ];

  var rows = () => {
    if (currentGrantDetail) {
      if (currentGrantDetail.renewals.length > 0) {
        return currentGrantDetail.renewals.map((x, i) => ({
          uid: x._id,
          RenewalAppliedDate:
            new Date(x.createdAt).getMonth() +
            1 +
            "/" +
            (new Date(x.createdAt).getDate() +
              "/" +
              new Date(x.createdAt).getFullYear()),
          RenewalAmount: ` $ ${x.renewal_fund}`,
          RenewalStatus: x.is_renewed ? (
            <Chip
              label="done"
              variant="outlined"
              style={{ background: "#81c784", border: "none" }}
            />
          ) : (
            <Chip
              label="pending"
              variant="outlined"
              style={{ background: "#e57373", border: "none" }}
            />
          ),
        }));
      } else return [];
    } else return [];
  };

  return (
    <DataSpecialistRenewGrantWrapper>
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
              Renew Grant for{" "}
              {currentGranteeDetail ? currentGranteeDetail.grantee_name : null}
              's{" "}
              {currentGrantDetail
                ? currentGrantDetail.grant_master_id.grant_name
                : null}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={2}>
                <p className="question">Renewal Grant amount</p>
              </Grid>
              <Grid item xs={11} md={8}>
                <CustomTextField
                  variant="outlined"
                  placeholder="Please enter the amount requested for the renewal of grant"
                  fullWidth
                  name="grant_name"
                  size="small"
                  onChange={(e) => {
                    setRenewGrantValue(e.target.value);
                  }}
                  value={renewGrantValue}
                />
              </Grid>
              <Grid
                item
                xs={1}
                md={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="text"
                  color="primary"
                  onClick={addButtonclickHandler}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
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
            <h1>No Renewal History Found ..</h1>
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
        primaryButtonHandler={confirmRenewGrantSubmit}
        secondaryButtonHandler={cancelRenewGrantSubmit}
      />
      {/* Loading Display */}
      <Backdrop className={classes.backdrop} open={submitLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </DataSpecialistRenewGrantWrapper>
  );
}

export default DataSpecialistRenewGrant;

const DataSpecialistRenewGrantWrapper = styled.section`
  .MuiAccordionSummary-expandIcon.Mui-expanded {
    transform: rotate(0deg) !important;
  }
  .ProjectListTable {
    margin-top: 100px;
  }
`;
