import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import PortFolioAtRiskDisplayCard from "../../../components/displayCards/portFolioAtRiskDisplayCard";
import { MasterRouteLinks } from "../../../router/linkMaster";

const Analytics = ({ dashData }) => {
  const history = useHistory();

  const ApprovedFundDataValueParser = (type, field) => {
    if (!dashData) return [];
    if (field === "label") {
      return dashData[type]
        .sort(
          (a, b) => new Date(a.grant_from_date).getMonth() - new Date(b.grant_from_date).getMonth()
        )
        .map((x) => {
          return new Date(x.grant_from_date).getMonth();
          // return `${new Date(x.grant_from_date).getMonth() + 1} - ${new Date(
          //   x.grant_from_date
          // ).getDate()} -${new Date(x.grant_from_date).getFullYear()}`;
        });
    }
    if (field === "value") {
      return dashData[type]
        .sort(
          (a, b) => new Date(a.grant_from_date).getMonth() - new Date(b.grant_from_date).getMonth()
        )
        .map((x) => {
          return parseInt(Math.round(x.grant_authorized));
        });
    }
  };
  const ApprovedFundAmountCalculator = (type) => {
    if (!dashData) return [];
    return dashData[type].reduce((total, obj) => obj.grant_authorized + total, 0);
  };
  const disbursedFundDataValueParser = () => {
    if (!dashData) return [];
    return [
      dashData.disbursedFund.firstQuarterDisbursed.reduce(
        (total, obj) => parseInt(obj.amount) + total,
        0
      ),
      dashData.disbursedFund.secondQuarterDisbursed.reduce(
        (total, obj) => parseInt(obj.amount) + total,
        0
      ),
      dashData.disbursedFund.thirdQuarterDisbursed.reduce(
        (total, obj) => parseInt(obj.amount) + total,
        0
      ),
      dashData.disbursedFund.fourthQuarterDisbursed.reduce(
        (total, obj) => parseInt(obj.amount) + total,
        0
      ),
    ];
  };
  const upcomingDisbursementValueParser = () => {
    if (!dashData) return [];
    return [
      dashData.upcomingDisbursements.firstQuarterDisbursed.reduce(
        (total, obj) => (obj.amount ? obj.amount + total : 0),
        0
      ),
      dashData.upcomingDisbursements.secondQuarterDisbursed.reduce(
        (total, obj) => (obj.amount ? obj.amount + total : 0),
        0
      ),
      dashData.upcomingDisbursements.thirdQuarterDisbursed.reduce(
        (total, obj) => (obj.amount ? obj.amount + total : 0),
        0
      ),
      dashData.upcomingDisbursements.fourthQuarterDisbursed.reduce(
        (total, obj) => (obj.amount ? obj.amount + total : 0),
        0
      ),
    ];
  };
  const acceptedGranteeValueParser = () => {
    if (!dashData) return [];
    return [
      dashData.portfolioRisk.low.length + dashData.portfolioRisk.medium.length,
      dashData.portfolioRisk.high.length,
    ];
  };
  const activitiesUnallowedValueParser = (type) => {
    if (!dashData) return [];
    return {
      data: [
        dashData[type].filter((activity) => activity.value === "Yes").length,
        dashData[type].filter((activity) => activity.value === "No").length,
      ],
      value: dashData[type].reduce((a, b) => a + (b["amount"] || 0), 0),
    };
  };
  const periodOfPerformance = () => {
    if (!dashData) return [];
    return {
      label: dashData.period_of_performance.map((x, i) => i + 1),
      authorized_grant: dashData.period_of_performance.map((x) => x.grant_authorized),
      total_disbursement: dashData.period_of_performance.map((x) => x.total_disbursed_fund),
    };
  };
  const programIncomeDataParse = () => {
    if (!dashData) return [];
    return [
      dashData.answerForProgramIncome.filter((x) => x === "Yes").length,
      dashData.answerForProgramIncome.filter((x) => x === "No").length,
    ];
  };
  const acceptedGranteeOptions = {
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
  };
  const approvedData = {
    labels: ApprovedFundDataValueParser("approvedFund", "label"),

    datasets: [
      {
        label: "Approved Fund",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: ApprovedFundDataValueParser("approvedFund", "value"),
      },
    ],
  };
  const disbursedFundData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "dollars",
        fill: false,
        barPercentage: 0.5,
        barwidth: 2,
        lineTension: 0.9,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: disbursedFundDataValueParser(),
      },
    ],
  };
  const upcomingDisbursementFundData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Fund",
        lineTension: 0.3,
        data: upcomingDisbursementValueParser(),
        backgroundColor: ["#FF2D6C", "#0BBE7C", "#4791FF", "#FFD950"],
        borderColor: ["#FF2D6C", "#0BBE7C", "#4791FF", "#FFD950"],
        borderWidth: 1,
      },
    ],
  };
  const acceptedApplicant = {
    labels: ["Accepted", "Rejected"],
    datasets: [
      {
        data: acceptedGranteeValueParser(),
        backgroundColor: ["#28C76F", "#EA5455"],
        borderColor: ["#28C76F", "#EA5455"],
        borderWidth: 0.1,
      },
    ],
  };
  const activitiesUnallowedData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        label: "Grantees performed Unallowed Expenses",
        data: activitiesUnallowedValueParser("answerOfActivitiesUnallowed").data,
        barPercentage: 0.3,
        backgroundColor: ["#FF2D6C", "#0BBE7C"],
        borderColor: ["#FF2D6C", "#0BBE7C"],
        borderWidth: 1,
        borderRadius: 0,
      },
    ],
  };
  const allowableCostPrinciples = {
    labels: ["Yes", "No"],
    datasets: [
      {
        label: "value",
        data: activitiesUnallowedValueParser("answerOfAllowableCostPrinciples").data,
        barPercentage: 0.3,
        backgroundColor: ["#EC6262", "#83D6B7"],
        borderColor: ["#EC6262", "#83D6B7"],
        borderWidth: 1,
      },
    ],
  };
  const procurementSuspensionData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        label: "value",
        data: activitiesUnallowedValueParser("answerOfProcurmentSuspensionDebarment").data,
        barPercentage: 0.3,
        backgroundColor: ["#EC6262", "#83D6B7"],
        borderColor: ["#EC6262", "#83D6B7"],
        borderWidth: 1,
      },
    ],
  };
  const approvedVsDisbursedData = {
    labels: periodOfPerformance().label,
    datasets: [
      {
        label: "authorized fund",
        data: periodOfPerformance().authorized_grant,
        backgroundColor: "#62a1ff",
      },
      {
        label: "disbursed fund",
        data: periodOfPerformance().total_disbursement,
        backgroundColor: "#ff2d6c",
      },
    ],
  };
  const approvedVsDisbursedOptions = {
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };
  const programIncomeData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        data: programIncomeDataParse(),
        barPercentage: 0.3,
        backgroundColor: ["#83D6B7", "#EC6262"],
        borderColor: ["#83D6B7", "#EC6262"],
        borderWidth: 1,
      },
    ],
  };
  const programDataOptions = {
    plugins: {
      legend: {
        display: false,
      },
      labels: {
        boxWidth: 0,
        color: "transparent",
      },
    },
  };
  return (
    <AnalyticsWrapper>
      {dashData != null ? (
        <Grid container spacing={4}>
          {/**
           * =================== Approved Fund =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Approved Fund</p>
                <h1>$ {ApprovedFundAmountCalculator("approvedFund").toLocaleString()}</h1>
              </div>
              <Line data={approvedData} />
            </Paper>
          </Grid>
          {/**
           * =================== Disbursed Fund =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Disbursed Fund</p>
                <h1>
                  ${" "}
                  {disbursedFundDataValueParser()
                    .reduce((a, b) => parseInt(a) + parseInt(b), 0)
                    .toLocaleString()}
                </h1>
              </div>
              <Bar data={disbursedFundData} />
            </Paper>
          </Grid>
          {/**
           * =================== Upcoming Disbursement =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Upcoming Disbursement</p>
                <h1>
                  ${" "}
                  {upcomingDisbursementValueParser()
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
                </h1>
              </div>
              <Line data={upcomingDisbursementFundData} />
            </Paper>
          </Grid>
          {/**
           * =================== Activities unallowed =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Activities Unallowed</p>
                <h1>
                  {/* {"Amount Expended" +
                    "   " +
                    "$" +
                    activitiesUnallowedValueParser(
                      "answerOfActivitiesUnallowed"
                    ).value} */}
                  {"$ " +
                    activitiesUnallowedValueParser(
                      "answerOfActivitiesUnallowed"
                    ).value.toLocaleString()}
                </h1>
              </div>
              <Bar data={activitiesUnallowedData} />
            </Paper>
          </Grid>
          {/**
           * =================== Allowable cost principles =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Allowable Cost Principles</p>
                <h1>
                  <pre> </pre>
                </h1>
              </div>
              <Bar data={allowableCostPrinciples} />
            </Paper>
          </Grid>
          {/**
           * =================== Accepted Grantee =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Grantee Accepted</p>
                <div className="customLegend">
                  <div>
                    <span
                      style={{
                        background: `${acceptedApplicant.datasets[0].backgroundColor[0]}`,
                      }}
                      className="customLegendFiller"
                    ></span>{" "}
                    <span>{acceptedApplicant.datasets[0].data[0]} Accepted</span>
                  </div>
                  <div>
                    <span
                      style={{
                        background: `${acceptedApplicant.datasets[0].backgroundColor[1]}`,
                      }}
                      className="customLegendFiller"
                    ></span>{" "}
                    <span>{acceptedApplicant.datasets[0].data[1]} Rejected</span>
                  </div>
                </div>
              </div>
              <div className="customSemiDoughnutHolder">
                <Doughnut data={acceptedApplicant} options={acceptedGranteeOptions} />
              </div>
            </Paper>
          </Grid>
          {/**
           * =================== procurement, suspension & debarment =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Procurement, Suspension , Debarment</p>
                <h1>
                  <pre> </pre>
                </h1>
              </div>
              <Bar data={procurementSuspensionData} />
            </Paper>
          </Grid>
          {/**
           * =================== period of performance =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Period of performance</p>
                <h1>
                  <pre> </pre>
                </h1>
              </div>
              <Bar data={approvedVsDisbursedData} options={approvedVsDisbursedOptions} />
            </Paper>
          </Grid>
          {/**
           * =================== Program income  =========================
           */}
          <Grid item xs={6} md={4}>
            <Paper elevation={10} className="customPaper">
              <div className="valueHolder">
                <p>Program income</p>
                <h1>
                  <pre> </pre>
                </h1>
              </div>
              <Bar data={programIncomeData} options={programDataOptions} />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <h1>Loading Analytics...</h1>
      )}
    </AnalyticsWrapper>
  );
};

export default Analytics;

export const AnalyticsWrapper = styled.section`
  .customPaper {
    padding: 20px;
    height: 100%;
  }
  .valueHolder {
    text-align: left;
  }
  .customLegend {
    display: flex;
    div {
      margin-right: 10px;
      font-size: 0.85em;
      color: #7a7a7a;
    }
    .customLegendFiller {
      width: 10px;
      height: 10px;
      display: inline-block;
    }
  }
  .customSemiDoughnutHolder {
    display: flex;
    align-items: center;
    height: 150px;
    ovverflow: hidden;
  }
`;
