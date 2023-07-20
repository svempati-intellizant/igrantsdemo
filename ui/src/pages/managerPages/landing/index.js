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
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
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

import PortFolioAtRiskDisplayCard from "../../../components/displayCards/portFolioAtRiskDisplayCard";

/**
 * function imports
 */
import { MasterRouteLinks } from "../../../router/linkMaster";

/**
 * Route imports
 */
import Analytics from "./analytics";
import ManagerGrantList from "../managerGrantList";
import ManagerGrantRiskAnalysis from "./grantRiskAnalysis";
import PrescriptionComponent from "./prescription";
import AgencyLevelAnalysis from "./agencyLevelAnalysis";
import ProgramLevelAnalysis from "./programLevelAnalysis";
import AgencyPortFolioLister from "./agencyPortfolioLister";
import ProgramPortfolioClassfier from "./programPortfolioClassfier";
import Loader from "../../../components/loading/bounceLoader";
import { div } from "prelude-ls";

function ManagerLanding() {
  let { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

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

  // - + - + - + - +- + - + Level selectors - + - +- + - +- + - + (agency / program /grant)
  const [viewMode, setViewMode] = useState("agency");

  // - + - + - + - +- + - + View Management - + - +- + - +- + - + (detailed analysis / predictive / prescriptive)
  const [currentView, setCurrentView] = useState("");

  // - + - + - + - +- + - + Content selectors - + - +- + - +- + - +
  const [agencyProgram, setAgencyProgram] = useState([]);
  const [programGrants, setProgramGrants] = useState(["grant1", "grant2", "grant3"]);

  const [selectedAgency, setSelectedAgency] = useState(myAgency);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedGrant, setSelectedGrant] = useState("");
  const [hideControls, setHideControls] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Mount lifecycle hook
  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("iGrants Risk Analysis"));
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

  // watching for location change
  useEffect(() => {
    const landView = pathLocation.split("/")[2];
    if (landView === "portfolio") {
      setViewMode(pathLocation.split("/")[3]);
    } else {
      setViewMode(landView);
    }

    if (landView === "grant") {
      setCurrentView(pathLocation.split("/")[3]);
      if (grantList) {
        const cur = grantList.filter((x) => x._id === pathLocation.split("/")[4])[0];
        const programListData = [
          ...new Set(grantList.filter((x) => x.agency === cur.agency).map((x) => x.program)),
        ];
        const grantListData = grantList.filter(
          (x) => x.agency === cur.agency && x.program === cur.program
        );
        console.log(cur, programListData, grantListData);
        setAgencyProgram(programListData);
        setProgramGrants(grantListData);
        setSelectedAgency(cur.agency);
        setSelectedProgram(cur.program);
        setSelectedGrant(cur);
      }
    }
    if (landView === "agency") {
      setSelectedAgency(pathLocation.split("/")[3].replaceAll("%20", " "));
    }
    if (landView === "program") {
      setSelectedAgency(pathLocation.split("/")[3].replaceAll("%20", " "));
      setSelectedProgram(pathLocation.split("/")[4].replaceAll("%20", " "));
    }
    if (landView === "portfolio") {
      setHideControls(true);
    } else {
      setHideControls(false);
      dispatch(setTitle("iGrants Risk Analysis"));
    }
  }, [pathLocation]);

  useEffect(() => {
    if (grantList) {
      const programListData = [
        ...new Set(grantList.filter((x) => x.agency === selectedAgency).map((x) => x.program)),
      ];

      const grantListData = grantList.filter(
        (x) => x.agency === selectedAgency && x.program === programListData[0]
      );

      setAgencyProgram(programListData);
      setProgramGrants(grantListData);
      if (selectedProgram === "") {
        setSelectedProgram(programListData[0]);
      }
      if (selectedGrant === "") {
        setSelectedGrant(grantListData[0]);
      }
      setLoaded(true);
    }
  }, [grantList]);

  // All Select Handlers
  const agencyChangeHandler = (event) => {
    console.log(event.target.value);
    setSelectedAgency(event.target.value);
    if (grantList) {
      const programListData = [
        ...new Set(grantList.filter((x) => x.agency === event.target.value).map((x) => x.program)),
      ];
      const grantListData = grantList.filter(
        (x) => x.agency === event.target.value && x.program === programListData[0]
      );
      setAgencyProgram(programListData);
      setProgramGrants(grantListData);
      setSelectedProgram(programListData[0]);
      setSelectedGrant(grantListData[0]);

      console.log(grantList.filter((x) => x.agency === event.target.value));
      switch (viewMode) {
        case "agency":
          history.push("/dashboard/agency/" + event.target.value);
          break;
        case "program":
          history.push("/dashboard/program/" + event.target.value + "/" + programListData[0]);
          break;
        case "grant":
          history.push("/dashboard/grant/predictive/" + grantListData[0]._id);
          break;
        case "portfolio":
          history.push("/dashboard/portfolio/agency/" + event.target.value + "/high");
          break;
        default:
          break;
      }
    }
  };
  const programChangeHandler = (event) => {
    setSelectedProgram(event.target.value);
    if (grantList) {
      const grantListData = grantList.filter(
        (x) => x.agency === selectedAgency && x.program === event.target.value
      );
      setProgramGrants(grantListData);

      switch (viewMode) {
        case "program":
          history.push("/dashboard/program/" + selectedAgency + "/" + event.target.value);
          break;
        case "grant":
          setSelectedGrant(grantListData[0]);
          history.push("/dashboard/grant/predictive/" + grantListData[0]._id);
        default:
          break;
      }
    }
  };
  const grantChangeHandler = (event, newvalue) => {
    if (newvalue != null) {
      setSelectedGrant(newvalue);
      if (grantList && selectedGrant) {
        history.push("/dashboard/grant/predictive/" + newvalue._id);
      }
    }
  };
  const modeChangeHandler = (event) => {
    setViewMode(event.target.value);
    switch (event.target.value) {
      case "agency":
        history.push("/dashboard/agency/" + selectedAgency);
        break;
      case "program":
        history.push("/dashboard/program/" + selectedAgency + "/" + selectedProgram);
        break;
      case "grant":
        history.push("/dashboard/grant/predictive/" + selectedGrant._id);
        break;
    }
  };

  // Chip or View Handler
  const chipClickHandler = (item) => {
    if (currentView === item && item != "predictive" && item != "prescriptive") {
      setCurrentView("");
      history.push("/dashboard");
    } else {
      setCurrentView(item);
      if (item === "detailed") {
        history.push("/dashboard/analytics");
      }
      if (item === "predictive") {
        history.push("/dashboard/grant/predictive/" + selectedGrant._id);
      }
      if (item === "prescriptive") {
        history.push("/dashboard/grant/prescriptive/" + selectedGrant._id);
      }
    }
  };

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

  return (
    <ManagerLandingWrapper>
      {grantList && (
        <div>
          {/* --------------------- CURRENT VIEW DISPLAYER ------------------------------*/}
          <Paper>
            {!false && (
              <div className="currentView">
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    {(viewMode === "agency" || viewMode === "program" || viewMode === "grant") && (
                      <p>
                        <b>Agency:</b> {selectedAgency.replaceAll("%20", " ")}
                      </p>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {(viewMode === "program" || viewMode === "grant") && (
                      <p>
                        <b>Program:</b> {selectedProgram}
                      </p>
                    )}
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    {viewMode === "grant" && (
                      <p>
                        <b>Grant:</b> {selectedGrant.grant_name}
                      </p>
                    )}
                  </Grid> */}
                </Grid>
              </div>
            )}
          </Paper>

          {/* ------------------------------------------------------------------------
      ------------------------------- ALL DROPDOWNS ------------------------------------
      ---------------------------------------------------------------------------- */}
          {!false && (
            <Paper elevation={3}>
              <div className="mainToggler">
                <Grid container spacing={3} className="customGridTop" alignItems="center">
                  {/*-------- MODE SELECTOR ---------- */}
                  <Grid item xs={12} md={2} className="customGridItemTop">
                    {currentView != "detailed" && (
                      <FormControl className="selector">
                        <InputLabel htmlFor="Control-level">Control Level</InputLabel>
                        <Select
                          native
                          value={viewMode}
                          id="Control-level"
                          onChange={modeChangeHandler}
                          inputProps={{
                            name: "age",
                            id: "age-native-simple",
                          }}
                        >
                          <option value="agency">Agency</option>
                          <option value="program">Program</option>
                          <option value="grant">Grant</option>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  {/* ------- AGENCY SELECTOR -------- */}
                  <Grid item xs={12} md={1} className="customGridItemTop">
                    <div className="selector">
                      {currentView != "detailed" && (
                        <FormControl>
                          <InputLabel htmlFor="agency-selector">Agency</InputLabel>
                          <NativeSelect
                            id="agency-selector"
                            value={selectedAgency}
                            onChange={agencyChangeHandler}
                          >
                            <option value="CDC">CDC</option>
                            <option value="ACF">ACF</option>
                            <option value="NATIONAL HEMOPHILLA FOUNDATION">NHF</option>
                            <option value="FDA">FDA</option>
                            <option value="NIH">NIH</option>
                          </NativeSelect>
                        </FormControl>
                      )}
                    </div>
                  </Grid>
                  {/* ------- PROGRAM SELECTOR -------- */}
                  <Grid item xs={12} md={3} className="customGridItemTop">
                    {(viewMode === "program" ||
                      viewMode === "grant" ||
                      pathLocation.split("/")[3] === "program") &&
                      currentView != "detailed" && (
                        <>
                          {/* <div className="selectorName">
                          <h4>Program</h4>
                        </div> */}
                          <div className="selector">
                            <FormControl>
                              <InputLabel htmlFor="program-selector">Program</InputLabel>
                              <NativeSelect
                                id="program-selector"
                                value={selectedProgram}
                                onChange={programChangeHandler}
                              >
                                {agencyProgram.map((x, i) => (
                                  <option value={x} key={i}>
                                    {x}
                                  </option>
                                ))}
                              </NativeSelect>
                            </FormControl>
                          </div>
                        </>
                      )}
                  </Grid>
                  {/* ------- Detailed SELECTOR -------- */}
                  <Grid item xs={12} md={6} style={{ textAlign: "right" }}>
                    <Chip
                      label="Detailed Analysis"
                      clickable
                      color="secondary"
                      variant={currentView === "detailed" ? "default" : "outlined"}
                      onClick={() => {
                        chipClickHandler("detailed");
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </Paper>
          )}

          {/* ------------------------------------------------------------------------
      ------------------------------- ANALYSIS TOGGLERS ------------------------------
      ---------------------------------------------------------------------------- */}

          {viewMode === "grant" && !false && (
            <Paper elevation={2} style={{ marginTop: "10px" }}>
              <div className="mainToggler">
                {/* -------------------------- pickers ----------------------------------*/}
                <Grid container spacing={3} className="customGridTop">
                  {/* ------- AGENCY SELECTOR -------- */}
                  <Grid item xs={12} md={3} className="customGridItemTop">
                    {viewMode === "grant" && (
                      <>
                        <Autocomplete
                          name="grant id"
                          options={programGrants}
                          getOptionLabel={(option) => option.grant_id}
                          style={{ width: "100%" }}
                          value={selectedGrant}
                          onChange={(event, newValue) => {
                            grantChangeHandler(event, newValue);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Grant Id" fullWidth />
                          )}
                        />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} md={5} className="customGridItemTop">
                    {viewMode === "grant" && (
                      <>
                        <Autocomplete
                          name="grant Name"
                          options={programGrants}
                          getOptionLabel={(option) => option.grant_name}
                          style={{ width: "100%" }}
                          value={selectedGrant}
                          onChange={(event, newValue) => {
                            grantChangeHandler(event, newValue);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Grant Name" fullWidth />
                          )}
                        />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} md={2} className="customGridItemTop">
                    <Chip
                      label="Predictive Analysis"
                      clickable
                      color="primary"
                      variant={currentView === "predictive" ? "default" : "outlined"}
                      onClick={() => {
                        chipClickHandler("predictive");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} className="customGridItemTop">
                    <Chip
                      label="Prescriptive Analysis"
                      clickable
                      color="primary"
                      variant={currentView === "prescriptive" ? "default" : "outlined"}
                      onClick={() => {
                        chipClickHandler("prescriptive");
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </Paper>
          )}

          {/* ------------------------------------------------------------------------
      ------------------------------- Router Area ------------------------------
      ---------------------------------------------------------------------------- */}
          <Paper style={{ marginTop: "0px" }}>
            <div className="content">
              <Switch>
                <Route exact path="/dashboard">
                  <Redirect to={`/dashboard/agency/${selectedAgency}`} />
                </Route>
                <Route exact path="/dashboard/agency">
                  <Redirect to={`/dashboard/agency/${selectedAgency}`} />
                </Route>
                <Route exact path="/dashboard/agency/:agencytarget">
                  <AgencyLevelAnalysis />
                </Route>
                <Route exact path="/dashboard/program/:agencytarget/:programTarget">
                  <ProgramLevelAnalysis />
                </Route>
                <Route exact path="/dashboard/grant/predictive/:grantId">
                  <ManagerGrantRiskAnalysis loaded={loaded} />
                </Route>
                <Route exact path="/dashboard/grant/prescriptive/:grantId">
                  <PrescriptionComponent loaded={loaded} />
                </Route>
                <Route exact path="/dashboard/portfolio/agency/:agencytarget/:type">
                  <AgencyPortFolioLister />
                </Route>
                <Route
                  exact
                  path="/dashboard/portfolio/program/:programTarget/agency/:agencytarget/:type"
                >
                  <ProgramPortfolioClassfier />
                </Route>
                <Route exact path="/dashboard/analytics">
                  <Analytics dashData={dashData} />
                </Route>
              </Switch>
            </div>
          </Paper>
        </div>
      )}
      {!grantList && (
        <div style={{ minHeight: "100vh" }}>
          <Loader />
        </div>
      )}
    </ManagerLandingWrapper>
  );
}

export default ManagerLanding;

const ManagerLandingWrapper = styled.section`
  .mainToggler {
    padding: 0px 0px 20px 0px;
    margin-bottom: 0px;
  }
  .customGridTop {
    padding: 0px 20px;
  }
  .modeSelector {
    background: #f4f2fc;
    padding: 15px 20px;
    margin-bottom: 20px;
    h4 {
      margin: 0px 10px 0px 0px;
    }
  }
  .customGridItemTop {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .selectorName h4 {
    margin: 0px 10px 0px 0px;
  }
  .selector {
    flex: 1;
  }
  .grantSelector {
    width: 100%;
  }
  .content {
    min-height: 500px;
    padding: 0px 20px 20px 20px;
    margin-top: 20px;
  }
  .currentView {
    padding: 0px 20px 0px 20px;
    margin-bottom: 20px;
    background: #020026;
    color: #fff;
  }
`;
