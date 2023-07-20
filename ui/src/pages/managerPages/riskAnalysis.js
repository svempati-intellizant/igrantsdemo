import RiskAnalysisDisplayCard from "../../components/displayCards/riskAnalysisDisplayCard";

import YearlyAnalysisDisplayCard from "../../components/displayCards/yearlyAnalysisCard";

import { fetchGrantListById } from "../../store/grantee/granteeActions";

import MultilineChartOutlinedIcon from "@material-ui/icons/MultilineChartOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";

import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, useParams } from "react-router-dom";
import {
  setLocation,
  setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import { useEffect } from "react";

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
function RiskAnalysis() {
  const dispatch = useDispatch();
  let { path, url } = useRouteMatch();
  const { granteeId } = useParams();

  useEffect(() => {
    dispatch(setLocation(path));

    dispatch(fetchGrantListById(granteeId)).then((res) => {
      let grant = res.grantList[0];
      dispatch(
        setTitle(`${grant.grantee_master_id.grantee_name}'s Assessment Score`)
      );
    });
  }, []);
  const grant = useSelector((state) => {
    return state.grantee.grantList.grants[0];
  });
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
        acc["performance_risk"] = Math.round(
          acc["performance_risk"] / arr.length
        );
        acc["financial_risk"] = Math.round(acc["financial_risk"] / arr.length);
        acc["quality_risk"] = Math.round(acc["quality_risk"] / arr.length);
        acc["compliance_risk"] = Math.round(
          acc["compliance_risk"] / arr.length
        );
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
        detailedRiskAnalysis["performance_risk"]["data"].push(
          x.Performance_Risk
        );
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
    <>
      {grant ? (
        <>
          <RiskAnalysisDisplayCard
            cardItems={cardItems}
            riskAnalysis={riskAnalysis}
            weightage={grant.weightage}
          />
          <YearlyAnalysisDisplayCard
            cardItems={cardItems}
            detailedRiskAnalysis={detailedRiskAnalysis}
          />
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
}

export default RiskAnalysis;
