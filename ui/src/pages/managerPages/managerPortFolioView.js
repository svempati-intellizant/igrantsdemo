import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory, useParams } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import OverviewDisplayCard from "../../components/displayCards/overviewDisplayCard";
import CustomTable from "../../components/customTable/customTable";
import {
  setLocation,
  setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import { fetchALLGranteeList } from "../../store/agency/agencyActions";
import { useTheme } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TimelineIcon from "@material-ui/icons/Timeline";
import { MasterRouteLinks } from "../../router/linkMaster";

const ManagerPortFolioView = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  let { path } = useRouteMatch();
  let { type } = useParams();

  const [filter, setToFilter] = useState("high");
  const [tableTitle, setTableTitle] = useState("with High Risk Profiles");

  const granteeList = useSelector((state) => {
    return state.agency.granteeList;
  });

  const tableLoading = useSelector((state) => {
    return state.agency.granteeListLoadingState;
  });

  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Portfolio Classifier"));
    setToFilter(type);
    if (granteeList === null) {
      dispatch(fetchALLGranteeList())
        .then((data) => {})
        .catch((err) => {});
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
      value: granteeList
        ? granteeList.filter((x) => x.risk === "low").length
        : "...",
      isactive: filter === "low",
      action: () => {
        setToFilter("low");
      },
    },
    {
      title: "Medium Risk",
      value: granteeList
        ? granteeList.filter((x) => x.risk === "medium").length
        : "...",
      isactive: filter === "medium",
      action: () => {
        setToFilter("medium");
      },
    },
    {
      title: "High Risk",
      value: granteeList
        ? granteeList.filter((x) => x.risk === "high").length
        : "...",
      isactive: filter === "high",
      action: () => {
        setToFilter("high");
      },
    },
  ];
  const headCells = [
    {
      id: "granteeName",
      disablePadding: false,
      label: "Grantee Name",
      sortable: true,
      searchable: true,
      align: "left",
      limit: 30,
    },
    {
      id: "ein",
      disablePadding: false,
      label: "EIN number",
      sortable: true,
      searchable: true,
    },
    {
      id: "riskrating",
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
    // {
    //   id: "viewRiskAnalysis",
    //   disablePadding: false,
    //   label: "Risk Analysis",
    //   sortable: false,
    //   searchable: false,
    // },
  ];
  const clickHandler = (id) => {
    history.push(`${MasterRouteLinks.grantList.baseUrl}/${id}`);
  };
  const rows = () => {
    if (granteeList && granteeList.length > 0) {
      return granteeList
        .filter((x) => x.risk === filter)
        .map((x, i) => ({
          uid: x._id,
          granteeName: x.grantee_name,
          ein: x.ein,
          riskrating:
            x.risk === "high" ? (
              <Chip
                size="small"
                label={x.risk.toUpperCase()}
                style={{ backgroundColor: "#F12B2C", color: "#fff" }}
              />
            ) : x.risk === "Not Calculated" ? (
              <Chip size="small" label={x.risk.toUpperCase()} />
            ) : x.risk === "low" ? (
              <Chip
                size="small"
                label={"LOW"}
                style={{ backgroundColor: "#29CC97" }}
              />
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
          <h1>No Grantee Details Found ..</h1>
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
