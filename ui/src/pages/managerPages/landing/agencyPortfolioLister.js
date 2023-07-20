import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory, useParams } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import OverviewDisplayCard from "../../../components/displayCards/overviewDisplayCard";
import CustomTable from "../../../components/customTable/customTable";
import { setLocation, setTitle } from "../../../store/drawerProperty/drawerPropertyActions";
import { fetchallGrantList } from "../../../store/grantee/granteeActions";
import { useTheme } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TimelineIcon from "@material-ui/icons/Timeline";
import { MasterRouteLinks } from "../../../router/linkMaster";

const ManagerPortFolioView = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  let { path } = useRouteMatch();
  let { agencytarget, type } = useParams();

  const [filter, setToFilter] = useState("high");
  const [tableLoading, setTableLoading] = useState(true);
  const [tableTitle, setTableTitle] = useState("with High Risk Profiles");

  const grantList = useSelector((state) => {
    return state.grantee.allGrants.filter((x) => x.agency === agencytarget);
  });

  useEffect(() => {
    dispatch(setTitle("Portfolio Classifier"));
    setToFilter(type);
    if (grantList === null) {
      dispatch(fetchallGrantList())
        .then((data) => {
          setTableLoading(false);
        })
        .catch((err) => {});
    } else {
      setTableLoading(false);
    }
  }, []);
  useEffect(() => {
    if (filter === "high") {
      setTableTitle("with High Risk Profiles");
    } else if (filter === "medium") {
      setTableTitle("with Medium Risk Profiles");
    } else if (filter === "low") {
      setTableTitle("with Low Risk Profiles");
    }
  }, [filter]);

  const cardItems = [
    {
      title: "Low Risk",
      value: grantList ? grantList.filter((x) => x.risk === "low").length : "...",
      isactive: filter === "low",
      action: () => {
        setToFilter("low");
      },
    },
    {
      title: "Medium Risk",
      value: grantList ? grantList.filter((x) => x.risk === "medium").length : "...",
      isactive: filter === "medium",
      action: () => {
        setToFilter("medium");
      },
    },
    {
      title: "High Risk",
      value: grantList ? grantList.filter((x) => x.risk === "high").length : "...",
      isactive: filter === "high",
      action: () => {
        setToFilter("high");
      },
    },
  ];
  const headCells = [
    {
      id: "grant_id",
      disablePadding: false,
      label: "Grant Id",
      sortable: true,
      searchable: true,
      align: "left",
    },
    {
      id: "grant_name",
      disablePadding: false,
      label: "Grant Name",
      sortable: true,
      searchable: true,
      limit: 30,
    },
    {
      id: "overall_risk",
      disablePadding: false,
      label: "Overall Risk",
      sortable: true,
      searchable: false,
    },
    {
      id: "risk_rating",
      disablePadding: false,
      label: "Risk",
      sortable: false,
      searchable: false,
    },
    {
      id: "viewdetails",
      disablePadding: false,
      label: "View Details",
      sortable: false,
      searchable: false,
    },
  ];
  const clickHandler = (id) => {
    history.push(`/dashboard/grant/predictive/${id}`);
  };
  const rows = () => {
    if (grantList && grantList.length > 0) {
      return grantList
        .filter((x) => x.risk === filter)
        .map((x, i) => ({
          uid: x._id,
          grant_id: x.grant_id,
          grant_name: x.grant_name,
          overall_risk: x.overall_risk.toFixed(2),
          risk_rating:
            x.risk === "high" ? (
              <Chip
                size="small"
                label={x.risk.toUpperCase()}
                style={{ backgroundColor: "#F12B2C", color: "#fff" }}
              />
            ) : x.risk === "Not Calculated" ? (
              <Chip size="small" label={x.risk.toUpperCase()} />
            ) : x.risk === "low" ? (
              <Chip size="small" label={"LOW"} style={{ backgroundColor: "#29CC97" }} />
            ) : x.risk === "medium" ? (
              <Chip
                size="small"
                label={x.risk.toUpperCase()}
                style={{ backgroundColor: "#FFD700" }}
              />
            ) : null,
          viewdetails: (
            <IconButton
              style={{ color: theme.palette.primary.dark }}
              onClick={() => {
                clickHandler(x._id);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          ),
          // viewRiskAnalysis: (
          //   <IconButton
          //     style={{ color: theme.palette.primary.dark }}
          //     onClick={() => {
          //       onRiskAnalysisClicked(x._id);
          //     }}
          //   >
          //     <TimelineIcon />
          //   </IconButton>
          // ),
        }));
    } else {
      return [];
    }
  };

  return (
    <ManagerPortFolioViewWrapper>
      <OverviewDisplayCard cardItems={cardItems} />
      {tableLoading ? (
        <div className="noTableData">
          <h1>Loading Table ..</h1>
        </div>
      ) : rows().length > 0 ? (
        <CustomTable
          rows={rows()}
          headCells={headCells}
          title={`List of Grantees ${tableTitle}`}
          showSelect={false}
        />
      ) : (
        <div className="noTableData">
          <h1>No Details Found ..</h1>
        </div>
      )}
    </ManagerPortFolioViewWrapper>
  );
};

export default ManagerPortFolioView;

export const ManagerPortFolioViewWrapper = styled.section`
  .MuiChip-label.MuiChip-labelSmall {
    font-size: 10px;
  }
`;
