import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { Doughnut, Line, Bar, Radar } from "react-chartjs-2";

function AgencyLevelAnalysis() {
  let { path } = useRouteMatch();
  const { agencytarget, programTarget } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  let pathLocation = window.location.pathname.replace("/igrant", "");

  const grantList = useSelector((state) => {
    return state.grantee.allGrants;
  });

  const [agencyList, setAgencyList] = useState(null);
  const [overallRiskDetail, setOverallRiskDetail] = useState(null);
  const [safRiskDetail, setSafRiskDetail] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    if (grantList) {
      setAgencyList(
        grantList.filter((x) => x.agency === agencytarget && x.program === programTarget)
      );
      console.log(
        grantList.filter((x) => x.agency === agencytarget && x.program === programTarget)
      );
    }
  }, [grantList, programTarget]);

  useEffect(() => {
    if (agencyList) {
      // overall risk
      const overallRisk =
        agencyList.reduce((a, x) => a + x.overall_risk || 0, 0) / agencyList.length;
      setOverallRiskDetail({
        score: overallRisk,
        doughnut: [overallRisk, 100 - overallRisk],
      });

      // saf risk
      const SafRisk =
        agencyList.reduce((a, x) => {
          if (x.saf_risk) {
            if (x.saf_risk === "grant_id not present") {
              return a + 0;
            } else {
              return a + x.saf_risk;
            }
          } else {
            return a + 0;
          }
        }, 0) / agencyList.length;
      setSafRiskDetail({
        score: SafRisk,
        doughnut: [SafRisk, 100 - SafRisk],
      });
      // setPortfolio
      setPortfolio([
        agencyList.filter((x) => x.risk === "low").length,
        agencyList.filter((x) => x.risk === "medium").length,
        agencyList.filter((x) => x.risk === "high").length,
      ]);

      history_parser(agencyList).then((res) => {
        setTrend(res);
        console.log(res);
      });
    }
  }, [agencyList, programTarget]);

  const riskValueOptions = {
    responsive: true,
    animation: {
      duration: 0,
    },
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

  const doughnutColorGetter = (score) => {
    if (score <= 30) {
      return "#5cc477";
    } else if (score > 30 && score <= 60) {
      return "#ffc800";
    } else if (score > 60) {
      return "#FF2D6C";
    }
  };

  const riskValue = {
    labels: ["Risk"],
    datasets: [
      {
        label: "Total Risk",
        data: overallRiskDetail ? overallRiskDetail.doughnut : [],
        backgroundColor: [
          doughnutColorGetter(overallRiskDetail ? overallRiskDetail.score : 0),
          "#D3D3D3",
        ],
        borderColor: [
          doughnutColorGetter(overallRiskDetail ? overallRiskDetail.score : 0),
          "#D3D3D3",
        ],
        borderWidth: 1,
      },
    ],
  };
  const saf = {
    labels: ["Risk"],
    datasets: [
      {
        label: "SAF Risk",
        data: safRiskDetail ? safRiskDetail.doughnut : [],
        backgroundColor: [doughnutColorGetter(safRiskDetail ? safRiskDetail.score : 0), "#D3D3D3"],
        borderColor: [doughnutColorGetter(safRiskDetail ? safRiskDetail.score : 0), "#D3D3D3"],
        borderWidth: 1,
      },
    ],
  };

  const portFolioatRiskValueParser = () => {
    if (!agencyList) return [];
    return [
      agencyList.filter((x) => x.risk === "low").length,
      agencyList.filter((x) => x.risk === "medium").length,
      agencyList.filter((x) => x.risk === "high").length,
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
    radius: 150,
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

  const history_parser = async (data) => {
    return new Promise((resolve, reject) => {
      const val = {};
      data.forEach((element, index) => {
        element.risk_analysis.forEach((element) => {
          if (index === 0) {
            val[element.year] = {
              Complaince_Risk: element.Complaince_Risk,
              Financial_Risk: element.Financial_Risk,
              Performance_Risk: element.Performance_Risk,
              Quality_Risk: element.Quality_Risk,
            };
          } else {
            val[element.year] = {
              Complaince_Risk: val[element.year].Complaince_Risk + element.Complaince_Risk,
              Financial_Risk: val[element.year].Financial_Risk + element.Financial_Risk,
              Performance_Risk: val[element.year].Performance_Risk + element.Performance_Risk,
              Quality_Risk: val[element.year].Quality_Risk + element.Quality_Risk,
            };
          }
        });
      });
      const final = {
        performance_risk: {
          datasets: [
            {
              label: "Performance Risk",
              data: [],
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#171257",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
            },
          ],
          labels: [],
        },
        financial_risk: {
          datasets: [
            {
              label: "Financial Risk",
              data: [],
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#595959",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
            },
          ],
          labels: [],
        },
        quality_risk: {
          datasets: [
            {
              label: "Quality Risk",
              data: [],
              fill: false,
              lineTension: 0.5,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
              // barThickness: 6,
            },
          ],
          labels: [],
        },
        compliance_risk: {
          datasets: [
            {
              label: "Compliance Risk",
              data: [],
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#7CD1D1",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
              // barThickness: 6,
            },
          ],
          labels: [],
        },
      };

      Object.keys(val)
        .sort((a, b) => a - b)
        .map((x) => {
          final.compliance_risk.datasets[0].data.push(val[x].Complaince_Risk / data.length);
          final.financial_risk.datasets[0].data.push(val[x].Financial_Risk / data.length);
          final.performance_risk.datasets[0].data.push(val[x].Performance_Risk / data.length);
          final.quality_risk.datasets[0].data.push(val[x].Quality_Risk / data.length);

          final.compliance_risk.labels.push(x);
          final.financial_risk.labels.push(x);
          final.performance_risk.labels.push(x);
          final.quality_risk.labels.push(x);
        });
      return resolve(final);
    });
  };

  const gotoPage = (val) => {
    history.push(`/dashboard/portfolio/program/${programTarget}/agency/${agencytarget}/${val}`);
  };

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
  };
  return (
    <AgencyLevelAnalysisWrapper>
      {agencyList && overallRiskDetail && safRiskDetail && portfolio && (
        <>
          <Grid container spacing={3} justify="space-around">
            {/* <Grid item xs={12} md={12}>
              <div className="LegendHolder">
                <span style={{ marginRight: "20px" }}>
                  <b>Risk Legend </b>
                </span>
                <div className="low">
                  <span className="box green"></span>
                  <span className="leg_val">0% - 30%</span>
                </div>
                <div className="medium">
                  <span className="box yellow"></span>
                  <span className="leg_val">30% - 60%</span>
                </div>
                <div className="high">
                  <span className="box red"></span>
                  <span className="leg_val">60% + </span>
                </div>
              </div>
            </Grid> */}
            <Grid item xs={12} md={3}>
              <h1 className="doughnutTitle">Overall risk</h1>
              <div className="doughnutHolder">
                <Doughnut data={riskValue} options={riskValueOptions} />
                <div className="doughnutRiskHoler">
                  <h1>{overallRiskDetail.score.toFixed(2)}%</h1>
                  <h2>Risk</h2>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <h1 className="doughnutTitle">Portfolio Classifier</h1>
              <div className="portfolioHolder">
                <div className="labelholder">
                  <div
                    className="toClick"
                    onClick={() => {
                      gotoPage("low");
                    }}
                  >
                    <span className="box green"></span>
                    {portfolio[0]} Low
                  </div>
                  <div
                    className="toClick"
                    onClick={() => {
                      gotoPage("medium");
                    }}
                  >
                    <span className="box yellow"></span>
                    {portfolio[1]} Medium
                  </div>{" "}
                  <div
                    className="toClick"
                    onClick={() => {
                      gotoPage("high");
                    }}
                  >
                    <span className="box red"></span>
                    {portfolio[2]} High
                  </div>
                </div>
                <Doughnut data={portFolioAtRisk} options={portFolioAtRiskOptions} />
              </div>
              <div style={{ textAlign: "center" }}>
                <b>Risk Legend </b>
              </div>
              <div className="LegendHolder">
                <div className="low">
                  <span className="box green"></span>
                  <span className="leg_val">0% - 30%</span>
                </div>
                <div className="medium">
                  <span className="box yellow"></span>
                  <span className="leg_val">30% - 60%</span>
                </div>
                <div className="high">
                  <span className="box red"></span>
                  <span className="leg_val">60% + </span>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={3}>
              <h1 className="doughnutTitle">SAF risk</h1>
              <div className="doughnutHolder">
                <Doughnut data={saf} options={riskValueOptions} />
                <div className="doughnutRiskHoler">
                  <h1>{safRiskDetail.score.toFixed(2)}%</h1>
                  <h2>Risk</h2>
                </div>
              </div>
            </Grid>
          </Grid>
          {/* + - + - + - + - + - + - + - + - + - + - + - + + - + - +
          - + - + - + - + - TREND ANALYSIS - + + - + - + - + - + - + - + - 
          - + - + - + - + - + - + + - + - + - + - + - + - + - + - + - + - + - */}
          <div className="secTite">
            <h2> Trend Analysis</h2>
          </div>
          {trend != null ? (
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <div className="pullUp">
                  <Line data={trend.compliance_risk} options={chartOptions}></Line>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="pullUp">
                  <Line data={trend.financial_risk} options={chartOptions}></Line>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="pullUp">
                  <Line data={trend.performance_risk} options={chartOptions}></Line>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="pullUp">
                  <Line data={trend.quality_risk} options={chartOptions}></Line>
                </div>
              </Grid>
            </Grid>
          ) : (
            "loading"
          )}
        </>
      )}
      {(!agencyList || !overallRiskDetail || !safRiskDetail) && <div>Loading ...</div>}
    </AgencyLevelAnalysisWrapper>
  );
}

export default AgencyLevelAnalysis;

const AgencyLevelAnalysisWrapper = styled.section`
  .overallRiskHolder {
    padding-bottom: 50px;
    border-bottom: 1px solid #d3d3d3;
  }
  .doughnutHolder {
    position: relative;
    padding: 30px;
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
        font-size: 22px;
      }
      @media only screen and (min-width: 900px) {
        font-size: 25px;
      }
    }
    h2 {
      margin: 0px auto;
      font-size: 18px;
      text-align: center;
    }
  }
  .doughnutTitle {
    text-align: center;
    font-size: 20px;
    margin: 0px 0px 10px 0px;
    @media only screen and (min-width: 600px) {
      font-size: 22px;
    }
    @media only screen and (min-width: 900px) {
      font-size: 28px;
    }
  }

  .portfolioHolder {
    height: 210px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .labelholder {
      position: absolute;
      display: flex;
      top: 0;
      div {
        margin-right: 10px;
      }
      div .box {
        width: 10px;
        height: 10px;

        margin-right: 5px;
        display: inline-block;
        &.green {
          background: #5cc477;
        }
        &.yellow {
          background: #ffd22f;
        }
        &.red {
          background: #e26063;
        }
      }
    }
  }
  .secTite {
    text-align: center;
    margin-top: 10px;
  }
  .toClick {
    cursor: pointer;
  }
  .LegendHolder {
    display: flex;
    justify-content: center;
    & > div {
      margin-right: 20px;
    }
  }
  .box {
    width: 10px;
    height: 10px;
    margin-right: 5px;
    display: inline-block;
    &.green {
      background: #5cc477;
    }
    &.yellow {
      background: #ffd22f;
    }
    &.red {
      background: #e26063;
    }
  }
  .pullUp {
    padding: 15px;
  }
  .pullUp {
    box-shadow: 0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%),
      0px 4px 18px 3px rgb(0 0 0 / 12%);
  }
`;
