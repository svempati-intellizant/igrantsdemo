/**
 * node module import
 */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Chip from "@material-ui/core/Chip";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "@material-ui/core/styles";
import OverViewDisplayCard from "../../components/displayCards/overviewDisplayCard";
import TimelineIcon from "@material-ui/icons/Timeline";

/**
 * Custom component imports
 */
import CustomTable from "../../components/customTable/customTable";

/**
 * Redux action imports
 */
import { setLocation, setTitle } from "../../store/drawerProperty/drawerPropertyActions";
import {
  getGranteeDetail,
  createGrant,
  fetchGrantListById,
  setGrantList,
} from "../../store/grantee/granteeActions";

/**
 * function imports
 */
import { MasterRouteLinks } from "../../router/linkMaster";

/**
 * Styles using material ui makestyles
 */

function DataSpecialistSingleGrantList() {
  // setup hooks
  const { granteeId, fromRoute } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  let { path, url } = useRouteMatch();

  // Use State hooks
  const [currentGranteeDetail, setCurrentGranteeDetail] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);

  // get state from redux
  const grantList = useSelector((state) => {
    return state.grantee.grantList.grants;
  });
  const tableData = useSelector((state) => {
    return state.grantee.grantList.tableData;
  });
  // Mount lifecycle hook
  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Grantee Detail"));
    dispatch(getGranteeDetail(granteeId)).then((res) => {
      if (res.error) {
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

  const riskScore =
    grantList.reduce((a, b) => a + parseFloat(b.risk_score ? b.risk_score["Total Risk"] : 0), 0) /
    grantList.reduce((total, obj) => {
      if (obj.risk_score) {
        return 1 + total;
      } else {
        return total;
      }
    }, 0);
  const riskValueParser = () => {
    if (!riskScore) return [];
    return [riskScore, 100 - riskScore];
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
  const onRiskAnalysisClicked = (id) => {
    if (path === "/dashboard/:fromRoute/grantlist/:granteeId") {
      history.push("/dashboard/" + fromRoute + "/riskanalysis/" + id);
    } else {
      history.push(`${MasterRouteLinks.grantRiskAnalysis.baseUrl}/${id}`);
    }
  };

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
  const cardItems = [
    {
      title: "Total Grants",
      value: grantList.length,
      action: setGrantList({ granteeId, status: "total" }),
    },
    {
      title: "New Grants",
      value: grantList ? grantList.filter((ele) => ele.grant_status === "fresh").length : 0,
      action: setGrantList({ granteeId, status: "fresh" }),
    },
    {
      title: "Ongoing Grants",
      value: grantList ? grantList.filter((ele) => ele.grant_status === "ongoing").length : 0,
      action: setGrantList({ granteeId, status: "ongoing" }),
    },
    {
      title: "Completed Grants",
      value: grantList ? grantList.filter((ele) => ele.grant_status === "completed").length : 0,
      action: setGrantList({ granteeId, status: "completed" }),
    },
  ];

  // Table headers
  const headCells = [
    {
      id: "duns",
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
      id: "riskRating",
      disablePadding: false,
      label: "Risk Score",
      sortable: false,
      searchable: false,
    },
    {
      id: "riskDetails",
      disablePadding: false,
      label: "Risk Analysis",
      sortable: false,
      searchable: false,
    },
  ];

  var rows = () => {
    if (tableData.length > 0) {
      return tableData.map((x, i) => ({
        uid: x._id,
        duns: x.grant_master_id.grant_id,
        nameOfGrant: x.grant_master_id.grant_name,
        modifiedAt: x.grant_master_id.grant_to_date
          ? x.grant_master_id.grant_to_date.substring(0, 10)
          : x.grant_master_id.grant_from_date.substring(0, 10),
        grantValue: x.grant_master_id.grant_authorized,
        riskRating:
          x.risk === "high" ? (
            <Chip
              size="small"
              label={x.risk.toUpperCase()}
              style={{ backgroundColor: "#F12B2C", color: "#fff" }}
            />
          ) : x.risk === "Not Calculated" ? (
            <Chip size="small" label={x.risk.toUpperCase()} />
          ) : x.risk === "good" ? (
            <Chip size="small" label={"LOW"} style={{ backgroundColor: "#29CC97" }} />
          ) : x.risk === "medium" ? (
            <Chip
              size="small"
              label={x.risk.toUpperCase()}
              style={{ backgroundColor: "#FFD700" }}
            />
          ) : null,
        riskDetails: (
          <IconButton
            style={{ color: theme.palette.primary.dark }}
            onClick={() => {
              onRiskAnalysisClicked(x.grant_master_id._id);
            }}
            disabled={x.risk === "Not Calculated"}
          >
            <TimelineIcon />
          </IconButton>
        ),
      }));
    } else return [];
  };

  return (
    <DataSpecialistSingleGrantListWrapper>
      <h1>{currentGranteeDetail ? currentGranteeDetail.grantee_name : ""}</h1>
      {/* ---------------------------------------------------------
       ---------------------  CUSTOM TABLE COMPONENT ------------------
       -------------------------------------------------------------
        */}
      <Grid container spacing={24} justify="center" className="overallRiskHolder">
        <Grid item xs={6} md={3} align="center">
          <div className="doughnutHolder">
            <Doughnut data={riskValue} options={riskValueOptions} />
            <div className="doughnutRiskHoler">
              <h1>{rows().length > 0 ? riskScore.toFixed(2) : ""}%</h1>
              <h2>Risk</h2>
            </div>
          </div>
        </Grid>
      </Grid>

      <OverViewDisplayCard cardItems={cardItems} />

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
    </DataSpecialistSingleGrantListWrapper>
  );
}

export default DataSpecialistSingleGrantList;

const DataSpecialistSingleGrantListWrapper = styled.section`
  .overallRiskHolder {
    margin-bottom: 80px;
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
  .MuiChip-label.MuiChip-labelSmall {
    font-size: 10px;
  }
`;
