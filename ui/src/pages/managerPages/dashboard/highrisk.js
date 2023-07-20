import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";

import CustomTable from "../../../components/customTable/customTable";

import { fetchallGrantList } from "../../../store/grantee/granteeActions";
import { useTheme } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";

const HighRiskProfileView = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();

  const grantList = useSelector((state) => {
    return state.grantee.allGrants;
  });
  const loading = useSelector((state) => {
    return state.grantee.allGrantsLoading;
  });
  const myAgency = useSelector((state) => {
    return state.auth.agency;
  });

  useEffect(() => {
    if (grantList === null) {
      dispatch(fetchallGrantList())
        .then((data) => {})
        .catch((err) => {});
    }
  }, []);

  const headCells = [
    {
      id: "grantid",
      disablePadding: false,
      label: "Grant Id",
      sortable: true,
      searchable: true,
      align: "left",
      limit: 30,
    },
    {
      id: "granteeName",
      disablePadding: false,
      label: "Grantee Name",
      sortable: true,
      searchable: true,
      limit: 30,
    },
    {
      id: "grantamount",
      disablePadding: false,
      label: "Grant Amount",
      sortable: true,
      searchable: true,
    },
    {
      id: "riskrating",
      disablePadding: false,
      label: "View Details",
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
    history.push(`/dashboard/highrisk/riskanalysis/${id}`);
  };
  const rows = () => {
    if (grantList && grantList.length > 0) {
      return grantList
        .filter((x) => x.risk === "high" && x.agency === myAgency)
        .map((x, i) => ({
          uid: x._id,
          grantid: x.grant_id,
          granteeName: x.grant_name,
          grantamount: x.grant_authorized
            ? "$" + x.grant_authorized.toFixed(2)
            : "-",
          riskrating: (
            <Chip
              size="small"
              label={x.risk.toUpperCase()}
              style={{ backgroundColor: "#F12B2C", color: "#fff" }}
            />
          ),
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
    <HighRiskProfileViewWrapper>
      {loading ? (
        <div className="noTableData">
          <h1>Loading Table ..</h1>
        </div>
      ) : rows().length > 0 ? (
        <CustomTable
          rows={rows()}
          headCells={headCells}
          title={`List of Grants with High Risk`}
          showSelect={false}
        />
      ) : (
        <div className="noTableData">
          <h1>No Grantee Details Found ..</h1>
        </div>
      )}
    </HighRiskProfileViewWrapper>
  );
};

export default HighRiskProfileView;

export const HighRiskProfileViewWrapper = styled.section`
  .MuiChip-label.MuiChip-labelSmall {
    font-size: 10px;
  }
`;
