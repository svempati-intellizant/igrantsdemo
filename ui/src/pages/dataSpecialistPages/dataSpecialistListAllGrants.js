/**
 * node module import
 */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
/**
 * Custom component imports
 */
import CustomTable from "../../components/customTable/customTable";
import OverViewDisplayCard from "../../components/displayCards/overviewDisplayCard";

/**
 * Redux action imports
 */
import {
    setLocation,
    setTitle,
} from "../../store/drawerProperty/drawerPropertyActions";
import { fetchallGrantList } from "../../store/grantee/granteeActions";

/**
 * function imports
 */
import { dataSpecialistRouteLinks } from "../../router/linkMaster";

function DataSpecialistListAllGrants() {
    // setup hooks
    const dispatch = useDispatch();
    const history = useHistory();
    const theme = useTheme();

    // get state from redux
    const allGrant = useSelector((state) => state.grantee.allGrants);
    const tableLoading = useSelector((state) => state.grantee.allGrantsLoading);

    // Mount lifecycle hook
    useEffect(() => {
        dispatch(setLocation(dataSpecialistRouteLinks.allGrantList));
        dispatch(setTitle("List of All Grants"));
        if (allGrant === null) {
            dispatch(fetchallGrantList())
                .then((res) => {})
                .catch((err) => {});
        }
    }, []);

    // Function to control CLick of Table Item
    const iconClickHandler = (granteeId) => {
        history.push(
            `${dataSpecialistRouteLinks.grantList.baseUrl}/${granteeId}`
        );
    };

    // Card data

    const cardItems = [
        {
            title: "Total Grants",
            value: allGrant ? allGrant.length : "-",
        },
    ];
    // Table headers
    const headCells = [
        {
            id: "grantId",
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
            id: "grantValue",
            disablePadding: true,
            label: "Grant Value",
            sortable: true,
            searchable: true,
        },
        {
            id: "granteeName",
            disablePadding: true,
            label: "Grantee Name",
            sortable: true,
            searchable: true,
            limit: 30,
        },
        {
            id: "viewGrantee",
            disablePadding: true,
            label: "View Grantee Detail",
            sortable: false,
            searchable: false,
        },
    ];
    // table rows
    var rows = () => {
        if (allGrant && allGrant.length > 0) {
            return allGrant.map((x, i) => ({
                uid: x._id,
                grantId: x.grant_id,
                nameOfGrant: x.grant_name,
                grantValue: x.grant_authorized,
                granteeName: x.grantee_name,
                viewGrantee: (
                    <IconButton
                        style={{ color: theme.palette.primary.dark }}
                        onClick={() => {
                            iconClickHandler(x.grantee_master_id);
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                ),
            }));
        } else return [];
    };

    return (
        <DataSpecialistListAllGrantsWrapper>
            <OverViewDisplayCard cardItems={cardItems} />

            {/* ---------------------------------------------------------
      ---------------------  CUSTOM TABLE COMPONENT ------------------
      -------------------------------------------------------------
       */}
            <div className="ProjectListTable">
                {tableLoading ? (
                    <div className="noTableData">
                        <h1>Loading Table ..</h1>
                    </div>
                ) : rows().length > 0 ? (
                    <CustomTable
                        rows={rows()}
                        headCells={headCells}
                        title="All Grants"
                        showSelect={false}
                    />
                ) : (
                    <div className="noTableData">
                        <h1>No Grant Details Found ..</h1>
                    </div>
                )}
            </div>
        </DataSpecialistListAllGrantsWrapper>
    );
}

export default DataSpecialistListAllGrants;

const DataSpecialistListAllGrantsWrapper = styled.section`
    .MuiAccordionSummary-expandIcon.Mui-expanded {
        transform: rotate(0deg) !important;
    }
    .ProjectListTable {
        margin-top: 0px;
    }
`;
