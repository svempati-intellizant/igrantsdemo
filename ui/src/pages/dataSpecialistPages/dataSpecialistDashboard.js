/**
 * node module import
 */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Chip from "@material-ui/core/Chip";
import { useTheme } from "@material-ui/core/styles";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
/**
 * Redux action imports
 */
import {
  setLocation,
  setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import { fetchALLGranteeList } from "../../store/grantee/granteeActions";
import { fetchAgencyDashboardData } from "../../store/agency/agencyActions";
/**
 * Custom component imports
 */
import CustomTable from "../../components/customTable/customTable";
import OverViewDisplayCard from "../../components/displayCards/overviewDisplayCard";
/**
 * function imports
 */
import { dataSpecialistRouteLinks } from "../../router/linkMaster";
/**
 * ===========================================================
 * ---------DATA SPECIALIST DASHBOARD ROUTE COMPONENT---------
 * ===========================================================
 */
const DataSpecialistDashboard = () => {
  // setup hooks
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  let { path, url } = useRouteMatch();

  // get state from redux
  const granteeList = useSelector((state) => {
    return state.grantee.granteeList;
  });

  const cardData = useSelector((state) => {
    const {
      agency: { agencydashboardData },
    } = state;
    return {
      total: agencydashboardData
        ? agencydashboardData.totalGrantee.length
        : "...",
      fresh: agencydashboardData
        ? agencydashboardData.freshGrantee.length
        : "...",
      ongoing: agencydashboardData
        ? agencydashboardData.ongoingGrantee.length
        : "...",
      completed: agencydashboardData
        ? agencydashboardData.completedGrantee.length
        : "...",
    };
  });

  //state management
  // const [cardData, setCardData] = useState({
  //   total: "...",
  //   fresh: "...",
  //   ongoing: "...",
  //   completed: "...",
  // });

  // Mount lifecycle hook
  useEffect(() => {
    dispatch(setLocation(path));
    dispatch(setTitle("Dashboard"));
    dispatch(fetchALLGranteeList());
    dispatch(fetchAgencyDashboardData())
      .then((res) => {
        // setCardData({
        //   total: res.totalGrantee.length,
        //   fresh: res.freshGrantee.length,
        //   ongoing: res.ongoingGrantee.length,
        //   completed: res.completedGrantee.length,
        // });
      })
      .catch((err) => {});
  }, []);

  const clickHandler = (id) => {
    history.push(`${dataSpecialistRouteLinks.grantList.baseUrl}/${id}`);
  };

  const rows = () => {
    if (granteeList && granteeList.length) {
      return granteeList.map((x, i) => ({
        uid: x._id,
        granteeName: x.grantee_name,
        ein: x.ein,
        ViewProject: (
          <IconButton
            style={{ color: theme.palette.primary.dark }}
            onClick={() => {
              clickHandler(x._id);
            }}
          >
            <VisibilityIcon />
          </IconButton>
        ),
      }));
    } else {
      return [];
    }
  };

  const headCells = [
    {
      id: "granteeName",
      disablePadding: false,
      label: "Grantee Name",
      sortable: true,
      searchable: true,
      align: "left",
    },
    {
      id: "ein",
      disablePadding: false,
      label: "EIN number",
      sortable: true,
      searchable: true,
    },
    {
      id: "ViewProject",
      disablePadding: false,
      label: "View Details",
      sortable: false,
      searchable: false,
    },
  ];

  const cardItems = [
    {
      title: "Total Grantee",
      value: cardData.total,
    },
    {
      title: "New Grantee",
      value: cardData.fresh,
    },
    {
      title: "Ongoing Grantee",
      value: cardData.ongoing,
    },
    {
      title: "Completed Grantee",
      value: cardData.completed,
    },
  ];
  return (
    <DataSpecialistDashboardWrapper>
      <OverViewDisplayCard cardItems={cardItems} />
      {rows().length > 0 ? (
        <CustomTable
          rows={rows()}
          headCells={headCells}
          title="All Grantee"
          showSelect={false}
        />
      ) : (
        <div className="noTableData">
          <h1>Loading dashboard ..</h1>
        </div>
      )}
    </DataSpecialistDashboardWrapper>
  );
};

export default DataSpecialistDashboard;

export const DataSpecialistDashboardWrapper = styled.section``;
