import React, { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PublishIcon from "@material-ui/icons/Publish";
import ViewListIcon from "@material-ui/icons/ViewList";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "../../store//authentication/authenticationActions";
import ConfirmationDialog from "../../components/alertAndDialog/confirmationDialog";
// import Logo icon
import logoicon from "../../assets/images/logo.svg";
// import Browser Router
import { BrowserRouter, Link } from "react-router-dom";
// import DATA SPECIALIST ROUTER
import { dataSpecialistRouteLinks } from "../../router/linkMaster";
import DataSpecialistRouter from "../../router/dataSpecialistRouter";
import { submitSingleAuditFile } from "../../store/grantee/granteeActions";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: "#F7F8FC",
    color: theme.palette.appbar.text,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    // backgroundColor: theme.palette.toolbar.main,
    color: theme.palette.toolbar.text,
    background:
      "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(16,12,77,1) 78%, rgba(34,28,105,1) 100%)",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    background: "#F7F8FC",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  avatar: {
    color: "#f7f8fc",
    // backgroundColor: "#67BCC5",
    background:
      "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(16,12,77,1) 78%, rgba(34,28,105,1) 100%)",
  },
  input: {
    display: "none",
  },
}));

function DataSpecialistRoute(props) {
  const { window } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const drawerData = useSelector((state) => {
    return state.drawer;
  });
  const authData = useSelector((state) => {
    return state.auth;
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  const logOut = () => {
    dispatch(logOutUser());
  };

  const fileSelectHandler = async (e) => {
    setFile(e.target.files[0]);
    setShowDialog(true);
  };
  const confirmSubmit = () => {
    setFileLoading(true);
    dispatch(submitSingleAuditFile(file))
      .then((res) => {
        setFileLoading(false);
        setShowDialog(false);
      })
      .catch((err) => {
        setFileLoading(false);
        setShowDialog(false);
      });
  };
  const cancelSubmit = () => {
    setFile(null);
    setShowDialog(false);
  };
  const drawer = (
    <div>
      <div className={classes.toolbar} style={{ position: "relative" }}>
        <div className="Drawerlogoholder ">
          <img src={logoicon} alt="logo" /> <span>Grantor Dashboard</span>
        </div>
      </div>
      <Divider />
      <List style={{ paddingBottom: "0px" }}>
        {/**
         * ===================================================
         * -------------------- Dashboard---------------------
         * ===================================================
         */}
        <Link to={dataSpecialistRouteLinks.dashboard}>
          <ListItem
            button
            className={
              drawerData.activeItem === dataSpecialistRouteLinks.dashboard
                ? "CustomDrawerItem activeDrawer"
                : "CustomDrawerItem"
            }
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <DashboardIcon
                htmlColor={
                  drawerData.activeItem === dataSpecialistRouteLinks.dashboard
                    ? theme.palette.toolbar.activetext
                    : theme.palette.toolbar.text
                }
              />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        {/**
         * ===================================================
         * -------------------List All Grant---------------------
         * ===================================================
         */}
        <Link to={dataSpecialistRouteLinks.allGrantList}>
          <ListItem
            button
            className={
              drawerData.activeItem === dataSpecialistRouteLinks.allGrantList
                ? "CustomDrawerItem activeDrawer"
                : "CustomDrawerItem"
            }
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <ViewListIcon
                htmlColor={
                  drawerData.activeItem ===
                  dataSpecialistRouteLinks.allGrantList
                    ? theme.palette.toolbar.activetext
                    : theme.palette.toolbar.text
                }
              />
            </ListItemIcon>
            <ListItemText primary="List All Grant" />
          </ListItem>
        </Link>
        {/**
         * ===================================================
         * -------------------Add new Grantee-----------------
         * ===================================================
         */}
        <Link to={dataSpecialistRouteLinks.addNewGrantee}>
          <ListItem
            button
            className={
              drawerData.activeItem === dataSpecialistRouteLinks.addNewGrantee
                ? "CustomDrawerItem activeDrawer"
                : "CustomDrawerItem"
            }
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <AddBoxIcon
                htmlColor={
                  drawerData.activeItem ===
                  dataSpecialistRouteLinks.addNewGrantee
                    ? theme.palette.toolbar.activetext
                    : theme.palette.toolbar.text
                }
              />
            </ListItemIcon>
            <ListItemText primary="Add New Grantee" />
          </ListItem>
        </Link>

        {/**
         * ===================================================
         * -------------Upload Single Audit file--------------
         * ===================================================
         */}
        <label htmlFor="contained-button-file">
          <ListItem
            htmlFor="contained-button-file"
            button
            className="CustomDrawerItem"
            onClick={closeDrawer}
          >
            <input
              accept="*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              onChange={fileSelectHandler}
            />
            <ListItemIcon>
              <PublishIcon htmlColor={theme.palette.toolbar.text} />
            </ListItemIcon>

            <ListItemText primary="Upload SAF" />
          </ListItem>
          {fileLoading ? <LinearProgress /> : null}
        </label>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logOut}>
          <ListItemIcon>
            <ExitToAppIcon htmlColor={theme.palette.toolbar.text} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <BrowserRouter>
      <DataSpecialistRouteWrapper>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar} elevation={0}>
            <Toolbar>
              <div className="expandLength">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                  {drawerData.drawerTitle}
                </Typography>
              </div>
              <div className="flexDisplay">
                <Hidden xsDown>
                  <h3 className="name">
                    {authData.email ? authData.email : "guest"}
                  </h3>
                  <Avatar className={classes.avatar}></Avatar>
                </Hidden>
                <Hidden smUp>
                  <Avatar className={classes.avatar}>
                    {" "}
                    {(authData.email ? authData.email : "guest")
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>
                </Hidden>
              </div>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <div className="mainContent">
              <DataSpecialistRouter />
            </div>
          </main>
        </div>
        <ConfirmationDialog
          dialogShow={showDialog}
          title="Are you sure want to submit the Single Audit File"
          content="On Pressing Confirm, you will upload the single audit file for data extraction."
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          primaryButtonHandler={confirmSubmit}
          secondaryButtonHandler={cancelSubmit}
        />
      </DataSpecialistRouteWrapper>
    </BrowserRouter>
  );
}

DataSpecialistRoute.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DataSpecialistRoute;

export const DataSpecialistRouteWrapper = styled.section`
  .mainContent {
    position: relative;
  }
  .expandLength {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .flexDisplay {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    .name {
      margin-right: 25px;
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
