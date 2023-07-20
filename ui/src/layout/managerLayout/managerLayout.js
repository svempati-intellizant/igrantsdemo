import React from "react";
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
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import PortraitIcon from "@material-ui/icons/Portrait";
import ViewListIcon from "@material-ui/icons/ViewList";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import styled from "styled-components";
import Fab from "@material-ui/core/Fab";

import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "../../store//authentication/authenticationActions";

// import Logo icon
import logoicon from "../../assets/images/logo.svg";
// import Browser Router
import { BrowserRouter, Link } from "react-router-dom";
// import DATA SPECIALIST ROUTER
import { MasterRouteLinks } from "../../router/linkMaster";
import ManagerRouter from "../../router/managerRouter";
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
}));

function DataSpecialistLayout(props) {
  const windows = props.window;
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
  const scrolltoTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} style={{ position: "relative" }}>
        <div className="Drawerlogoholder ">
          <img src={logoicon} alt="logo" /> <span>Agency Dashboard</span>
        </div>
      </div>
      <Divider />
      <List style={{ paddingBottom: "0px" }}>
        <Link to={MasterRouteLinks.dashboard}>
          <ListItem
            button
            className={
              drawerData.activeItem &&
              drawerData.activeItem.includes("dashboard")
                ? "CustomDrawerItem activeDrawer"
                : "CustomDrawerItem"
            }
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <DashboardIcon
                htmlColor={
                  drawerData.activeItem &&
                  drawerData.activeItem.includes("dashboard")
                    ? theme.palette.toolbar.activetext
                    : theme.palette.toolbar.text
                }
              />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>

        <Link to={MasterRouteLinks.granteeList}>
          <ListItem
            button
            className={
              drawerData.activeItem === MasterRouteLinks.granteeList
                ? "CustomDrawerItem activeDrawer"
                : "CustomDrawerItem"
            }
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <ViewListIcon
                htmlColor={
                  drawerData.activeItem === MasterRouteLinks.granteeList
                    ? theme.palette.toolbar.activetext
                    : theme.palette.toolbar.text
                }
              />
            </ListItemIcon>
            <ListItemText primary="Grantee List" />
          </ListItem>
        </Link>
        <Link to={`${MasterRouteLinks.portfolioView.baseUrl}/high`}>
          <ListItem
            button
            className={
              drawerData.activeItem ===
              `${MasterRouteLinks.portfolioView.baseUrl}${MasterRouteLinks.portfolioView.param}`
                ? "CustomDrawerItem activeDrawer"
                : "CustomDrawerItem"
            }
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <PortraitIcon
                htmlColor={
                  drawerData.activeItem ===
                  `${MasterRouteLinks.portfolioView.baseUrl}${MasterRouteLinks.portfolioView.param}`
                    ? theme.palette.toolbar.activetext
                    : theme.palette.toolbar.text
                }
              />
            </ListItemIcon>
            <ListItemText primary="Portfolio" />
          </ListItem>
        </Link>
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
    windows !== undefined ? () => window().document.body : undefined;

  return (
    <BrowserRouter>
      <DataSpecialistLayoutWrapper>
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
              <Fab
                size="small"
                color="secondary"
                aria-label="add"
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  zIndex: "9999",
                }}
                onClick={scrolltoTop}
              >
                <ArrowUpwardIcon />
              </Fab>
              <ManagerRouter />
            </div>
          </main>
        </div>
      </DataSpecialistLayoutWrapper>
    </BrowserRouter>
  );
}

DataSpecialistLayout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DataSpecialistLayout;

export const DataSpecialistLayoutWrapper = styled.section`
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
