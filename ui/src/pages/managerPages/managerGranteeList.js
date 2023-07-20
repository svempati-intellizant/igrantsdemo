import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import OverviewDisplayCard from "../../components/displayCards/overviewDisplayCard";
import CustomTable from "../../components/customTable/customTable";
import {
  setLocation,
  setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import { useTheme } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";
import {
  fetchALLGranteeList,
  setGranteeTableList,
} from "../../store/agency/agencyActions";
import TimelineIcon from "@material-ui/icons/Timeline";
import { MasterRouteLinks } from "../../router/linkMaster";

const ManagerGranteeList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  let { path, url } = useRouteMatch();

  const [filter, setToFilter] = useState("all");
  const [tableTitle, setTableTitle] = useState("Total Grantee");

  const tableKey = useSelector((state) => {
    return state.agency.granteeTableStatus;
  });

  const granteeList = useSelector((state) => {
    return state.agency.granteeList;
  });

  const tableLoading = useSelector((state) => {
    return state.agency.granteeListLoadingState;
  });
  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Grantee List"));
    if (granteeList === null) {
      dispatch(fetchALLGranteeList())
        .then((data) => {})
        .catch((err) => {});
    }
  }, []);

  const cardItems = [
    {
      title: "Total Grantee",
      value: granteeList
        ? granteeList.filter(
            (x) => x.grant_status === "ongoing" || "fresh" || "completed"
          ).length
        : "...",
      isactive: filter === "all",
      action: () => {
        setTableTitle("Total Grantee");
        setToFilter("all");
      },
    },
    {
      title: "New Grantee",
      value: granteeList
        ? granteeList.filter((x) => x.grant_status === "fresh").length
        : "...",
      isactive: filter === "fresh",
      action: () => {
        setToFilter("fresh");
        setTableTitle("New Grantee");
      },
    },
    {
      title: "Ongoing Grantee",
      value: granteeList
        ? granteeList.filter((x) => x.grant_status === "ongoing").length
        : "...",
      isactive: filter === "ongoing",
      action: () => {
        setToFilter("ongoing");
        setTableTitle("Ongoing Grantee");
      },
    },
    {
      title: "Completed Grantee",
      value: granteeList
        ? granteeList.filter((x) => x.grant_status === "completed").length
        : "...",
      isactive: filter === "completed",
      action: () => {
        setToFilter("completed");
        setTableTitle("Completed Grantee");
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
  const onRiskAnalysisClicked = (id) => {
    history.push(`${MasterRouteLinks.riskAnalysis.baseUrl}/${id}`);
    const grantee = granteeList[tableKey.status].find(
      (grantee) => grantee._id === id
    );
    dispatch(setTitle(`${grantee.grantee_name}'s Assesment Scores`));
  };
  const rows = () => {
    if (granteeList && granteeList.length > 0) {
      return granteeList
        .filter((x) => {
          if (filter === "all") {
            return true;
          } else {
            return x.grant_status === filter;
          }
        })
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
    <ManagerGranteeListWrapper>
      <OverviewDisplayCard cardItems={cardItems} />
      {tableLoading ? (
        <div className="noTableData">
          <h1>Loading Table ..</h1>
        </div>
      ) : rows().length > 0 ? (
        <CustomTable
          rows={rows()}
          headCells={headCells}
          title={`List of Grantees (${tableTitle})`}
          showSelect={false}
        />
      ) : (
        <div className="noTableData">
          <h1>No Grant Details Found ..</h1>
        </div>
      )}
    </ManagerGranteeListWrapper>
  );
};

export default ManagerGranteeList;

export const ManagerGranteeListWrapper = styled.section`
  .MuiChip-label.MuiChip-labelSmall {
    font-size: 10px;
  }
`;
