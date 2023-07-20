/**
 * node module import
 */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouteMatch, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MultilineChartOutlinedIcon from "@material-ui/icons/MultilineChartOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import { Doughnut } from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
/**
 * redux actions import
 */
import { setLocation, setTitle } from "../../store/drawerProperty/drawerPropertyActions";
import { fetchIndividualGrantDetail } from "../../store/agency/agencyActions";
/**
 * Custom components import
 */
import RiskAnalysisDisplayCard from "../../components/displayCards/riskAnalysisDisplayCard";
import YearlyAnalysisDisplayCard from "../../components/displayCards/yearlyAnalysisCard";

/**
 * Manager Page Individual Grant Risk Analysis
 */

function ManagerGrantRiskAnalysis() {
  // Setup hooks
  const dispatch = useDispatch();
  const { grantId } = useParams();
  let { path, url } = useRouteMatch();
  let pathLocation = window.location.pathname.replace("/igrant", "");

  // Setup state management
  const [grant, setGrant] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [safRiskScore, setSafRiskScore] = useState(null);
  // Component mount kifecycle hooks
  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Grant Risk Analysis"));
    dispatch(fetchIndividualGrantDetail(grantId))
      .then((res) => {
        setGrant(res);
        setRiskScore(res.risk_score["Total Risk"]);
        if (typeof res.risk_score.SAF === "number") {
          setSafRiskScore(res.risk_score.SAF);
        }
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    setGrant(null);
    dispatch(fetchIndividualGrantDetail(grantId))
      .then((res) => {
        setGrant(res);
        setRiskScore(res.risk_score["Total Risk"]);
        if (typeof res.risk_score.SAF === "number") {
          setSafRiskScore(res.risk_score.SAF);
        }
      })
      .catch((err) => {});
  }, [pathLocation]);

  const riskValueParser = () => {
    if (!riskScore) return [];
    return [riskScore, 100 - riskScore];
  };
  const safriskvalueparser = () => {
    if (!safRiskScore) return [];
    return [safRiskScore, 100 - safRiskScore];
  };
  const riskscoreSetter = (val) => {
    setRiskScore(val);
  };
  const doughnutColorGetter = (score) => {
    if (score <= 30) {
      return "#5cc477";
    } else if (score > 30 && score <= 60) {
      return "#ffc800";
    } else if (score > 60) {
      return "#FF2D6C";
    }
  };
  const cardItems = [
    {
      styles: { backgroundColor: "#EFECFD", color: "#7C72EB" },
      icon: () => <MultilineChartOutlinedIcon style={{ fontSize: "35px" }} />,
      title: "Performance Risk",
      key: "performance_risk",
    },
    {
      styles: { backgroundColor: "#E0F9FD", color: "#52CDDB" },
      icon: () => <PersonOutlineIcon style={{ fontSize: "35px" }} />,
      title: "Financial Risk",
      key: "financial_risk",
    },
    {
      styles: { backgroundColor: "#FCEAEA", color: "#E26063" },
      icon: () => <AssignmentTurnedInOutlinedIcon style={{ fontSize: "35px" }} />,
      title: "Quality Risk",
      key: "quality_risk",
    },
    {
      styles: { backgroundColor: "#E6F7F1", color: "#5CC477" },
      icon: () => <AttachMoneyOutlinedIcon style={{ fontSize: "35px" }} />,
      title: "Compliance Risk",
      key: "compliance_risk",
    },
  ];
  const riskValue = {
    labels: ["Risk"],
    datasets: [
      {
        label: "Total Risk",
        data: riskValueParser(),
        backgroundColor: [doughnutColorGetter(riskScore), "#D3D3D3"],
        borderColor: [doughnutColorGetter(riskScore), "#D3D3D3"],
        borderWidth: 1,
      },
    ],
  };
  const riskValueOptions = {
    responsive: true,
    // animation: {
    //   duration: 1
    // },
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      labels: {
        boxWidth: 0,
        color: "transparent",
      },
      tooltip: false,
    },
  };
  const safRiskValue = {
    labels: ["Risk"],
    datasets: [
      {
        label: "Total Risk",
        data: safriskvalueparser(),
        backgroundColor: [doughnutColorGetter(safRiskScore), "#D3D3D3"],
        borderColor: [doughnutColorGetter(safRiskScore), "#D3D3D3"],
        borderWidth: 1,
      },
    ],
  };
  let riskAnalysis = {};
  let detailedRiskAnalysis = {};

  if (grant) {
    // riskAnalysis = grant.risk_analysis.reduce((acc, obj, idx, arr) => {
    //     if (!isNaN(obj["Performance_Risk"])) {
    //         if (!acc["performance_risk"]) {
    //             acc["performance_risk"] = obj["Performance_Risk"];
    //         } else {
    //             acc["performance_risk"] += obj["Performance_Risk"];
    //         }
    //     }
    //     if (!isNaN(obj["Financial_Risk"])) {
    //         if (!acc["financial_risk"]) {
    //             acc["financial_risk"] = obj["Financial_Risk"];
    //         } else {
    //             acc["financial_risk"] += obj["Financial_Risk"];
    //         }
    //     }
    //     if (!isNaN(obj["Complaince_Risk"])) {
    //         if (!acc["compliance_risk"]) {
    //             acc["compliance_risk"] = obj["Complaince_Risk"];
    //         } else {
    //             acc["compliance_risk"] += obj["Complaince_Risk"];
    //         }
    //     }
    //     if (!isNaN(obj["Quality_Risk"])) {
    //         if (!acc["quality_risk"]) {
    //             acc["quality_risk"] = obj["Quality_Risk"];
    //         } else {
    //             acc["quality_risk"] += obj["Quality_Risk"];
    //         }
    //     }
    //     if (idx === arr.length - 1) {
    //         acc["performance_risk"] = Math.round(
    //             acc["performance_risk"] / arr.length
    //         );
    //         acc["financial_risk"] = Math.round(
    //             acc["financial_risk"] / arr.length
    //         );
    //         acc["quality_risk"] = Math.round(
    //             acc["quality_risk"] / arr.length
    //         );
    //         acc["compliance_risk"] = Math.round(
    //             acc["compliance_risk"] / arr.length
    //         );
    //     }

    //     return acc;
    // }, {});
    riskAnalysis = {
      performance_risk: parseInt(grant.risk_score["Performance Risk"]),
      financial_risk: parseInt(grant.risk_score["Financial Risk"]),
      quality_risk: parseInt(grant.risk_score["Quality Risk"]),
      compliance_risk: parseInt(grant.risk_score["Complaince Risk"]),
    };

    grant.risk_analysis
      .sort((a, b) => a.year - b.year)
      .map((x, idx) => {
        if (idx === 0) {
          detailedRiskAnalysis["performance_risk"] = {
            data: [x.Performance_Risk],
            label: [x.year],
            heading: "Performance Risk",
          };
          detailedRiskAnalysis["financial_risk"] = {
            data: [x.Financial_Risk],
            label: [x.year],
            heading: "Financial Risk",
          };
          detailedRiskAnalysis["quality_risk"] = {
            data: [x.Quality_Risk],
            label: [x.year],
            heading: "Quality Risk",
          };
          detailedRiskAnalysis["compliance_risk"] = {
            data: [x.Complaince_Risk],
            label: [x.year],
            heading: "Compliance Risk",
          };
        } else {
          detailedRiskAnalysis["performance_risk"]["data"].push(x.Performance_Risk);
          detailedRiskAnalysis["performance_risk"]["label"].push(x.year);

          detailedRiskAnalysis["financial_risk"]["data"].push(x.Financial_Risk);
          detailedRiskAnalysis["financial_risk"]["label"].push(x.year);

          detailedRiskAnalysis["compliance_risk"]["data"].push(x.Complaince_Risk);
          detailedRiskAnalysis["compliance_risk"]["label"].push(x.year);

          detailedRiskAnalysis["quality_risk"]["data"].push(x.Quality_Risk);
          detailedRiskAnalysis["quality_risk"]["label"].push(x.year);
        }
      });
  }

  return (
    <ManagerGrantRiskAnalysisWrapper>
      {grant ? (
        <>
          <RiskAnalysisDisplayCard
            title={grant.grant_master_id.grant_name}
            cardItems={cardItems}
            riskAnalysis={riskAnalysis}
            weightage={grant.weightage}
            riskscoreSetter={riskscoreSetter}
            standardRisk={grant.risk_score["Total Risk"]}
          />
          <Grid container justify="space-around" className="overallRiskHolder">
            <Grid item xs={6} md={2} align="center">
              <h1 className="doughnutTitle">Overall risk</h1>
              <div className="doughnutHolder">
                <Doughnut data={riskValue} options={riskValueOptions} />
                <div className="doughnutRiskHoler">
                  <h1>{riskScore.toFixed(2)}%</h1>
                  <h2>Risk</h2>
                </div>
              </div>
            </Grid>
            {safRiskScore && (
              <Grid item xs={6} md={2} align="center">
                <h1 className="doughnutTitle">SAF risk</h1>
                <div className="doughnutHolder">
                  <Doughnut data={safRiskValue} options={riskValueOptions} />
                  <div className="doughnutRiskHoler">
                    <h1>{safRiskScore.toFixed(2)}%</h1>
                    <h2>Risk</h2>
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
          <YearlyAnalysisDisplayCard
            cardItems={cardItems}
            detailedRiskAnalysis={detailedRiskAnalysis}
          />
        </>
      ) : (
        <p>Loading</p>
      )}
    </ManagerGrantRiskAnalysisWrapper>
  );
}

export default ManagerGrantRiskAnalysis;

const ManagerGrantRiskAnalysisWrapper = styled.section`
  .overallRiskHolder {
    padding-bottom: 50px;
    border-bottom: 1px solid #d3d3d3;
  }
  .doughnutHolder {
    position: relative;
  }
  .doughnutRiskHoler {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    h1 {
      font-size: 20px;
      margin: 0px auto;
      @media only screen and (min-width: 600px) {
        font-size: 25px;
      }
      @media only screen and (min-width: 900px) {
        font-size: 30px;
      }
    }
    h2 {
      margin: 0px auto;
      font-size: 18px;
    }
  }
  .doughnutTitle {
    font-size: 20px;
    @media only screen and (min-width: 600px) {
      font-size: 22px;
    }
    @media only screen and (min-width: 900px) {
      font-size: 28px;
    }
  }
`;
