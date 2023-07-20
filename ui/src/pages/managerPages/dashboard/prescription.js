/**
 * node module import
 */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouteMatch, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MultilineChartOutlinedIcon from "@material-ui/icons/MultilineChartOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import Grid from "@material-ui/core/Grid";
/**
 * redux actions import
 */
import { setLocation, setTitle } from "../../../store/drawerProperty/drawerPropertyActions";
import { fetchIndividualGrantDetail } from "../../../store/agency/agencyActions";
/**
 * Custom components import
 */

/**
 * Manager Page Individual Grant Risk Analysis
 */

function Prescription() {
  // Setup hooks
  const dispatch = useDispatch();
  const { grantId } = useParams();
  let { path } = useRouteMatch();
  let pathLocation = window.location.pathname.replace("/igrant", "");

  const grantList = useSelector((state) => {
    return state.grantee.allGrants;
  });

  // Setup state management
  const [grant, setGrant] = useState(null);
  const [prescription, setPrescription] = useState(null);
  // Component mount kifecycle hooks
  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Grant Risk Analysis"));
    dispatch(fetchIndividualGrantDetail(grantId))
      .then((res) => {
        setGrant(res);
      })
      .catch((err) => {});
    const id = pathLocation.slice(pathLocation.lastIndexOf("/")).replace("/", "");
    if (grantList && grantList.length > 0) {
      setPrescription(grantList.filter((x) => x._id === id)[0].prescription);
    }
  }, []);

  useEffect(() => {
    setGrant(null);
    dispatch(fetchIndividualGrantDetail(grantId))
      .then((res) => {
        setGrant(res);
      })
      .catch((err) => {});
  }, [pathLocation]);

  const backgroundColourSelector = (type) => {
    if (riskAnalysis[type] && riskAnalysis[type] <= 30) {
      return { background: "#e6f7f1" };
    } else if (riskAnalysis[type] && riskAnalysis[type] > 30 && riskAnalysis[type] <= 60) {
      return { background: "#fff3c6" };
    } else if (riskAnalysis[type] && riskAnalysis[type] > 60) {
      return { background: "#fceaea" };
    }
  };
  let riskAnalysis = {};
  let detailedRiskAnalysis = {};

  if (grant) {
    riskAnalysis = grant.risk_analysis.reduce((acc, obj, idx, arr) => {
      if (!isNaN(obj["Performance_Risk"])) {
        if (!acc["performance_risk"]) {
          acc["performance_risk"] = obj["Performance_Risk"];
        } else {
          acc["performance_risk"] += obj["Performance_Risk"];
        }
      }
      if (!isNaN(obj["Financial_Risk"])) {
        if (!acc["financial_risk"]) {
          acc["financial_risk"] = obj["Financial_Risk"];
        } else {
          acc["financial_risk"] += obj["Financial_Risk"];
        }
      }
      if (!isNaN(obj["Complaince_Risk"])) {
        if (!acc["compliance_risk"]) {
          acc["compliance_risk"] = obj["Complaince_Risk"];
        } else {
          acc["compliance_risk"] += obj["Complaince_Risk"];
        }
      }
      if (!isNaN(obj["Quality_Risk"])) {
        if (!acc["quality_risk"]) {
          acc["quality_risk"] = obj["Quality_Risk"];
        } else {
          acc["quality_risk"] += obj["Quality_Risk"];
        }
      }
      if (idx === arr.length - 1) {
        acc["performance_risk"] = Math.round(acc["performance_risk"] / arr.length);
        acc["financial_risk"] = Math.round(acc["financial_risk"] / arr.length);
        acc["quality_risk"] = Math.round(acc["quality_risk"] / arr.length);
        acc["compliance_risk"] = Math.round(acc["compliance_risk"] / arr.length);
      }

      return acc;
    }, {});

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
        }
        detailedRiskAnalysis["performance_risk"]["data"].push(x.Performance_Risk);
        detailedRiskAnalysis["performance_risk"]["label"].push(x.year);

        detailedRiskAnalysis["financial_risk"]["data"].push(x.Financial_Risk);
        detailedRiskAnalysis["financial_risk"]["label"].push(x.year);

        detailedRiskAnalysis["compliance_risk"]["data"].push(x.Complaince_Risk);
        detailedRiskAnalysis["compliance_risk"]["label"].push(x.year);

        detailedRiskAnalysis["quality_risk"]["data"].push(x.Quality_Risk);
        detailedRiskAnalysis["quality_risk"]["label"].push(x.year);
      });
  }

  return (
    <PrescriptionWrapper>
      {grant && prescription ? (
        <>
          <div className="TitleCard">
            <h3>{grant.grant_master_id.grant_name}</h3>
            {console.log(riskAnalysis)}
          </div>
          <Grid container className="table">
            {/* Performance */}
            <Grid item xs={12} md={3} style={backgroundColourSelector("performance_risk")}>
              <h3>Performance Risk</h3>
              <ul className="prescItem">
                {prescription["Performance Risk"].map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </Grid>
            {/* Financial */}
            <Grid item xs={12} md={3} style={backgroundColourSelector("financial_risk")}>
              <h3>Financial Risk</h3>
              <ul className="prescItem">
                {prescription["Financial Risk"].map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </Grid>
            {/* Quality */}
            <Grid item xs={12} md={3} style={backgroundColourSelector("quality_risk")}>
              <h3>Quality Risk</h3>
              <ul className="prescItem">
                {prescription["Quality Risk"].map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </Grid>
            {/* Compliance */}
            <Grid item xs={12} md={3} style={backgroundColourSelector("compliance_risk")}>
              <h3>Compliance Risk</h3>
              <ul className="prescItem">
                {prescription["Complaince Risk"].map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </>
      ) : (
        <p>Loading</p>
      )}
    </PrescriptionWrapper>
  );
}

export default Prescription;

const PrescriptionWrapper = styled.section`
  .TitleCard {
    text-align: center;
    color: #3751ff;
  }
  .table {
    h3 {
      text-align: center;
    }
  }
`;
