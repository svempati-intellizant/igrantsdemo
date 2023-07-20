/**
 * node module import
 */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import { useRouteMatch, useHistory } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import Filter1Icon from "@material-ui/icons/Filter1";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Switch as SwitchButton } from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

/**
 * Redux action imports
 */
import { setLocation, setTitle } from "../../../store/drawerProperty/drawerPropertyActions";
/**
 * Custom component imports
 */
import { fetchAgencyDashboardData } from "../../../store/agency/agencyActions";
import { fetchallGrantList } from "../../../store/grantee/granteeActions";
import Analytics from "./analytics";
import PortFolioAtRiskDisplayCard from "../../../components/displayCards/portFolioAtRiskDisplayCard";
import SingleMultiGrant from "./singleMultiGrant";
import ManagerGrantList from "../managerGrantList";
import ManagerGrantRiskAnalysis from "../managerGrantRiskAnalysis";
import PrescriptionComponent from "./prescription";
/**
 * function imports
 */
import { MasterRouteLinks } from "../../../router/linkMaster";

/**
 * ===========================================================
 * ------------ AGENCY  DASHBOARD ROUTE COMPONENT------------
 * ===========================================================
 */

const ManagerDashboard = () => {
  let { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const scrollLevel = useRef(null);
  const didMountRef = useRef(false);
  let pathLocation = window.location.pathname.replace("/igrant", "");

  const myAgency = useSelector((state) => {
    return state.auth.agency;
  });

  const grantList = useSelector((state) => {
    return state.grantee.allGrants;
  });

  // get state from redux
  const dashData = useSelector((state) => {
    return state.agency.agencydashboardData;
  });
  const dashdataLoadingState = useSelector((state) => {
    return state.agency.dashboardLoadingState;
  });

  // State management Hooks
  const [currentView, setCurrentView] = useState("analytics");
  const [showBack, setShowback] = useState(false);
  const [HighRiskGrantList, setHighRiskGrantList] = useState([]);
  const [selectedRiskEntity, setSelectedRiskEntity] = useState(null);
  const [selectedAgency, setAgency] = useState(myAgency);
  const [checked, setChecked] = useState(false);
  const [isPrescAvailable, setIsPrescAvailable] = useState(true);

  // Mount lifecycle hook
  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Health and Human Services - (Parent Agency) Dashboard"));
    if (dashData === null) {
      dispatch(fetchAgencyDashboardData())
        .then((res) => {})
        .catch((err) => {});
    }
    if (grantList === null) {
      dispatch(fetchallGrantList())
        .then((data) => {})
        .catch((err) => {});
    }
  }, []);

  useEffect(() => {
    setCurrentView(pathLocation.split("/").slice(2, 3).join("/"));
    if (pathLocation.includes("prescription")) {
      setChecked(true);
    } else {
      setChecked(false);
    }
    const id = pathLocation.slice(pathLocation.lastIndexOf("/")).replace("/", "");
    if (grantList && grantList.length > 0 && grantList.filter((x) => x._id === id).length > 0) {
      setIsPrescAvailable(true);
    } else {
      setIsPrescAvailable(false);
    }

    const toTop = scrollLevel.current.offsetTop;
    if (didMountRef.current) {
      window.scroll({
        top: toTop,
        left: 0,
        behavior: "smooth",
      });
    } else didMountRef.current = true;
  }, [pathLocation]);

  useEffect(() => {
    if (grantList && grantList.length > 0) {
      const data = grantList.filter((x) => x.risk === "high" && x.agency === selectedAgency);
      setHighRiskGrantList(data);

      if (data.length > 0) {
        setSelectedRiskEntity(data[0]);
        if (currentView === "highrisk") {
          setChecked(false);
          history.push("/dashboard/highrisk/riskanalysis/" + data[0]._id);
        }
      } else {
        setSelectedRiskEntity(null);
      }
    }
  }, [grantList, selectedAgency]);

  const cardItems = [
    {
      title: "Total Grantee",
      value: dashData ? dashData.totalGrantee.length : "...",
    },
    {
      title: "New Grant",
      value: dashData ? dashData.freshGrantee.length : "...",
    },
    {
      title: "Ongoing Grant",
      value: dashData ? dashData.ongoingGrantee.length : "...",
    },
    {
      title: "Completed Grant",
      value: dashData ? dashData.completedGrantee.length : "...",
    },
  ];
  const portFolioAtRiskCardData = [
    {
      title: "Low",
      data: dashData ? dashData.portfolioRisk.low.length : "...",
      styles: { backgroundColor: "#E6F7F1", color: "#5CC477" },
      icon: () => <SentimentVerySatisfiedIcon style={{ fontSize: "35px" }} />,
      clickAction: () => {
        history.push(MasterRouteLinks.portfolioView.baseUrl + "/low");
      },
    },
    {
      title: "Medium",
      data: dashData ? dashData.portfolioRisk.medium.length : "...",
      styles: { backgroundColor: "#fff3c6", color: "#ffc800" },
      icon: () => <SentimentDissatisfiedIcon style={{ fontSize: "35px" }} />,
      clickAction: () => {
        history.push(MasterRouteLinks.portfolioView.baseUrl + "/medium");
      },
    },
    {
      title: "High",
      data: dashData ? dashData.portfolioRisk.high.length : "...",
      styles: { backgroundColor: "#FCEAEA", color: "#E26063" },
      icon: () => <SentimentVeryDissatisfiedIcon style={{ fontSize: "35px" }} />,
      clickAction: () => {
        history.push(MasterRouteLinks.portfolioView.baseUrl + "/high");
      },
    },
  ];
  const portFolioatRiskValueParser = () => {
    if (!dashData) return [];
    return [
      dashData.portfolioRisk.low.length,
      dashData.portfolioRisk.medium.length,
      dashData.portfolioRisk.high.length,
    ];
  };
  const portFolioAtRisk = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Grants",
        data: portFolioatRiskValueParser(),
        backgroundColor: ["#0BBE7C", "#FFD950", "#FF2D6C"],
        // borderColor: ["#0BBE7C", "#FFD950", "#FF2D6C"],
      },
    ],
  };
  const portFolioAtRiskOptions = {
    radius: 100,
    cutout: "50%",
    responsive: true,
    maintainAspectRatio: true,
    circumference: 180,
    rotation: 270,
    title: {
      display: true,
      text: "Average Rainfall per month",
      fontSize: 20,
    },
    percentageInnerCutout: 20,
    cutoutPercentage: 70,
    plugins: {
      legend: {
        display: false,
      },
      labels: {
        boxWidth: 0,
        color: "transparent",
      },
    },
    animation: {
      duration: 0,
    },
  };
  const chipClickHandler = (item) => {
    setCurrentView(item);
    setShowback(true);
    history.push("/dashboard/" + item);
  };
  const goBackHandler = () => {
    history.go(-1);
  };
  const agencyChangeHandler = (event) => {
    setAgency(event.target.value);
  };
  const highRiskGrantSelector = (newValue) => {
    setSelectedRiskEntity(newValue);
    if (newValue != null && !checked) {
      history.push("/dashboard/highrisk/riskanalysis/" + newValue._id);
    }
    if (newValue != null && checked) {
      history.push("/dashboard/highrisk/prescription/" + newValue._id);
    }
  };
  const toggleChecked = () => {
    if (checked) {
      setChecked(false);
      history.push(pathLocation.replace("prescription", "riskanalysis"));
    } else {
      setChecked(true);
      history.push(pathLocation.replace("riskanalysis", "prescription"));
    }
  };

  return (
    <ManagerDashboardWrapper>
      {/* <OverviewDisplayCard cardItems={cardItems} /> */}
      {/**
       * =================== Portfolio at risk Ribbon=========================
       */}
      <Grid container spacing={4} style={{ marginTop: "10px" }}>
        <Grid item xs={12} md={12}>
          <PortFolioAtRiskDisplayCard
            cardItems={portFolioAtRiskCardData}
            portFolioAtRisk={portFolioAtRisk}
            portFolioAtRiskOptions={portFolioAtRiskOptions}
          />
        </Grid>
      </Grid>

      {/**
       * =================== Selector card =========================
       */}
      <Paper ref={scrollLevel} style={{ paddingBottom: "15px" }}>
        <div className="titleBar">
          <Grid container alignItems="center">
            <Grid item xs={3}>
              <div className="agencySelector">
                <h4 className="noMargin">Agency</h4>
                <FormControl>
                  <Select
                    id="agency-selector"
                    value={selectedAgency}
                    onChange={agencyChangeHandler}
                  >
                    <MenuItem value="CDC">CDC</MenuItem>
                    <MenuItem value="ACF">ACF</MenuItem>
                    <MenuItem value="NATIONAL HEMOPHILLA FOUNDATION">NHF</MenuItem>
                    <MenuItem value="FDA">FDA</MenuItem>
                    <MenuItem value="NIH">NIH</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={6}>
              <h2 className="noMargin">
                {checked ? "Prescriptive Analysis" : "Predictive Analysis"}{" "}
              </h2>
            </Grid>
            <Grid item xs={3}>
              {isPrescAvailable && (
                <Grid container spacing={2} className="toggleHolder" justify="space-around">
                  <Grid item>Predictive</Grid>
                  <Grid item>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <SwitchButton size="small" checked={checked} onChange={toggleChecked} />
                        }
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item>Prescriptive</Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </div>
        <div className="selectorArea">
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Chip
                icon={<Filter1Icon />}
                label="Single Grant"
                clickable
                color="primary"
                variant={currentView === "single" ? "default" : "outlined"}
                onClick={() => {
                  chipClickHandler("single");
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Chip
                icon={<ControlCameraIcon />}
                label="Multi Grant"
                clickable
                color="secondary"
                variant={currentView === "multi" ? "default" : "outlined"}
                onClick={() => {
                  chipClickHandler("multi");
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Chip
                icon={<AssessmentIcon />}
                label="Overall Analysis"
                clickable
                color="primary"
                variant={currentView === "analytics" ? "default" : "outlined"}
                onClick={() => {
                  chipClickHandler("analytics");
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Chip
                icon={<ErrorOutlineIcon />}
                label="High Risk"
                clickable
                variant={currentView === "highrisk" ? "default" : "outlined"}
                color="secondary"
                onClick={() => {
                  chipClickHandler("highrisk");
                }}
              />
            </Grid>
          </Grid>
        </div>

        {currentView === "highrisk" && (
          <div className="RiskGrantSelectorArea">
            <Grid container spacing={3} justify="flex-end">
              <Grid item xs={3}>
                <Autocomplete
                  name="grant id"
                  options={HighRiskGrantList}
                  getOptionLabel={(option) => option.grant_id}
                  style={{ width: "100%" }}
                  value={selectedRiskEntity}
                  onChange={(event, newValue) => {
                    highRiskGrantSelector(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Grant Id" fullWidth />}
                />
              </Grid>
              <Grid item xs={5}>
                <Autocomplete
                  name="grant id"
                  options={HighRiskGrantList}
                  getOptionLabel={(option) => option.grant_name}
                  style={{ width: "100%" }}
                  value={selectedRiskEntity}
                  onChange={(event, newValue) => {
                    highRiskGrantSelector(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Grant Name" fullWidth />}
                />
              </Grid>
            </Grid>
          </div>
        )}
      </Paper>

      {/* =================== SUB ROUTES ====================== */}
      <Paper style={{ marginTop: "10px" }}>
        <div className="content">
          <Switch>
            <Route exact path={path}>
              {/* <Redirect to="/dashboard/analytics" /> */}
              {selectedRiskEntity != null && (
                <Redirect to={`/dashboard/highrisk/riskanalysis/${selectedRiskEntity._id}`} />
              )}
              {selectedRiskEntity === null && <h1>No Grant records found for this profile ...</h1>}
            </Route>
            <Route exact path="/dashboard/analytics">
              <Analytics dashData={dashData} />
            </Route>
            <Route exact path="/dashboard/highrisk">
              {selectedRiskEntity != null && (
                <Redirect to={`/dashboard/highrisk/riskanalysis/${selectedRiskEntity._id}`} />
              )}
              {selectedRiskEntity === null && <h1>No Grant records found for this profile ...</h1>}
            </Route>
            <Route exact path="/dashboard/single">
              <SingleMultiGrant type="single" agency={selectedAgency} />
            </Route>
            <Route exact path="/dashboard/multi">
              <SingleMultiGrant type="multi" agency={selectedAgency} />
            </Route>
            <Route exact path="/dashboard/multi">
              <SingleMultiGrant type="multi" agency={selectedAgency} />
            </Route>
            <Route exact path="/dashboard/:fromRoute/grantlist/:granteeId">
              <ManagerGrantList />
            </Route>
            <Route path="exact" path="/dashboard/:fromRoute/riskanalysis/:grantId">
              <ManagerGrantRiskAnalysis />
            </Route>
            <Route path="exact" path="/dashboard/:fromRoute/prescription/:grantId">
              <PrescriptionComponent />
            </Route>
          </Switch>
        </div>
      </Paper>
    </ManagerDashboardWrapper>
  );
};

export default ManagerDashboard;

export const ManagerDashboardWrapper = styled.section`
  .titleBar {
    padding: 10px 20px 20px 20px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .agencySelector {
    padding-left: 10px;
    display: flex;
    align-items: center;
    #agency-selector {
      min-width: 80px;
    }
    h4 {
      margin-right: 20px;
    }
  }
  .content {
    min-height: 500px;
    padding: 0px 20px 20px 20px;
  }
  .RiskGrantSelectorArea {
    padding: 30px 20px 10px 20px;
  }
  .selectorArea {
    // padding: 20px 20px;
    // margin-bottom: 50px;
    .MuiGrid-item {
      display: flex;
      justify-content: center;
    }
  }
  .toggleHolder {
    background: #ececfd;
    border-radius: 20px;
    width: 100%;
  }
  .noMargin {
    margin: 0;
  }
`;
