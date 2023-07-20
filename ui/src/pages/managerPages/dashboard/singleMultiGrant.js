import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";

import CustomTable from "../../../components/customTable/customTable";

import { fetchSingleMultiData } from "../../../store/agency/agencyActions";
import { useTheme } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { MasterRouteLinks } from "../../../router/linkMaster";

const SingleMultiGrant = ({ type, agency }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();

  const grantList = useSelector((state) => {
    return state.agency.singleMultiData;
  });
  const loading = useSelector((state) => {
    return state.agency.singleMultiLoading;
  });

  useEffect(() => {
    if (grantList === null) {
      dispatch(fetchSingleMultiData())
        .then((data) => {})
        .catch((err) => {});
    }
  }, []);

  const headCells = [
    {
      id: "ein",
      disablePadding: false,
      label: "EIN number",
      sortable: true,
      searchable: true,
    },
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
      id: "riskscore",
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
    history.push("/dashboard/" + type + "/grantlist/" + id);
  };
  const rows = () => {
    if (grantList && grantList.length > 0) {
      return grantList
        .filter((x) => x.grant_availed === type && x.agency === agency)
        .map((x, i) => ({
          uid: x._id,
          ein: x.ein,
          granteeName: x.grantee_name,
          riskscore:
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
        }));
    } else {
      return [];
    }
  };

  return (
    <SingleMultiGrantWrapper>
      {loading ? (
        <div className="noTableData">
          <h1>Loading Table ..</h1>
        </div>
      ) : rows().length > 0 ? (
        <CustomTable
          rows={rows()}
          headCells={headCells}
          title={`List of Grantees with ${
            type === "single" ? "Single" : "Multiple"
          } Grant`}
          showSelect={false}
        />
      ) : (
        <div className="noTableData">
          <h1>No Grantee Details Found ..</h1>
        </div>
      )}
    </SingleMultiGrantWrapper>
  );
};

export default SingleMultiGrant;

export const SingleMultiGrantWrapper = styled.section`
  .MuiChip-label.MuiChip-labelSmall {
    font-size: 10px;
  }
`;
