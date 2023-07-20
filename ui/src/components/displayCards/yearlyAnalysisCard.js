import React from "react";
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";
import { Bar } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    height: "100%",
    fontSize: "14px",
  },
  paperTitle: {
    color: theme.palette.text.secondary,
  },
  paperValue: {
    color: theme.palette.text.primary,
  },
  image: {
    width: 128,
    height: 128,
    borderRadius: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "50%",
    maxHeight: "50%",
  },
}));
function YearlyAnalysisDisplayCard({ cardItems, detailedRiskAnalysis }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            weight: "bolder",
          },
        },
      },
    },
    animation: {
      duration: 0,
    },
  };
  return (
    <YearlyAnalysisDisplayCardWrapper color={theme.palette}>
      <Paper className={`${classes.paper} custompaper`} elevation={2}>
        <h2 style={{ textAlign: "center" }}>Trend Analysis</h2>
        <Grid container spacing={4}>
          {cardItems.map((item, i) => {
            const key = item.key;

            return (
              <Grid
                onClick={(e) => {
                  item.action && dispatch(item.action);
                }}
                item
                xs={12}
                sm={6}
                md={6}
                key={i}
                elevation={0}
              >
                <Paper className={`${classes.paper} pullUp`} elevation={0}>
                  {key === "performance_risk" || key === "financial_risk" ? (
                    <Bar
                      data={{
                        labels: detailedRiskAnalysis[key]["label"],
                        datasets: [
                          {
                            type: "line",
                            label: detailedRiskAnalysis[key]["heading"] + " trend",
                            borderColor: "rgba(0,0,0,1)",
                            backgroundColor: item.styles.color,
                            lineTension: 0.5,
                            borderWidth: 2,
                            fill: false,
                            data: detailedRiskAnalysis[key]["data"],
                          },
                          {
                            type: "bar",
                            label: detailedRiskAnalysis[key]["heading"],
                            fill: false,
                            lineTension: 0.5,
                            backgroundColor: item.styles.backgroundColor,
                            borderColor: item.styles.color,
                            borderWidth: 2,
                            borderRadius: 10,
                            barThickness: 12,
                            data: detailedRiskAnalysis[key]["data"],
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <Bar
                      data={{
                        labels: detailedRiskAnalysis[key]["label"],
                        datasets: [
                          {
                            type: "line",
                            label: detailedRiskAnalysis[key]["heading"] + " trend",
                            borderColor: "rgba(0,0,0,1)",
                            backgroundColor: item.styles.color,
                            lineTension: 0.5,
                            borderWidth: 2,
                            fill: false,
                            data: detailedRiskAnalysis[key]["data"],
                          },
                          {
                            type: "bar",
                            label: detailedRiskAnalysis[key]["heading"],
                            fill: false,
                            lineTension: 0.5,
                            backgroundColor: item.styles.backgroundColor,
                            borderColor: item.styles.color,
                            borderWidth: 2,
                            borderRadius: 10,
                            barThickness: 12,
                            data: detailedRiskAnalysis[key]["data"],
                          },
                        ],
                      }}
                      options={chartOptions}
                      // options={{
                      //   indexAxis: "y",
                      //   // Elements options apply to all of the options unless overridden in a dataset
                      //   // In this case, we are setting the border of each horizontal bar to be 2px wide
                      //   elements: {
                      //     bar: {
                      //       borderWidth: 2,
                      //     },
                      //   },
                      //   responsive: true,
                      //   plugins: {
                      //     legend: {
                      //       position: "right",
                      //     },
                      //     title: {
                      //       display: true,
                      //       text: detailedRiskAnalysis[key]["heading"],
                      //     },
                      //   },
                      // }}
                    />
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </YearlyAnalysisDisplayCardWrapper>
  );
}

export default YearlyAnalysisDisplayCard;

export const YearlyAnalysisDisplayCardWrapper = styled.section`
  padding-bottom: 50px;
  .paperTitle {
    font-size: 19px;
    margin: 10px 0px;
  }
  .paperValue {
    font-size: 40px;
    margin: 10px 0px;
    font-weight: 500;
  }
  .custompaper {
    background-color: #f7f8fc;
    cursor: default;

    &:hover {
      .paperTitle,
      .paperValue {
        color: #fff !important;
      }
    }
  }
  .pullUp {
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%),
      0px 4px 18px 3px rgb(0 0 0 / 12%);
  }
`;
