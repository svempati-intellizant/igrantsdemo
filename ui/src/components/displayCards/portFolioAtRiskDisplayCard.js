import React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
// import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import { useDispatch, useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    height: "100%",
    fontSize: "14px",
  },
  paperTitle: {
    color: theme.palette.text.secondary,
  },
  paperValue: {
    color: theme.palette.text.primary,
  },
  image: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "50%",
    maxHeight: "50%",
  },
}));

function PortFolioAtRiskDisplayCard({ cardItems, portFolioAtRisk, portFolioAtRiskOptions }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const theme = useTheme();
  const loading = useSelector((state) => {
    return state.agency.dashboardLoadingState;
  });

  return (
    <PortFolioAtRiskDisplayCardWrapper>
      <Paper className={`${classes.paper} custompaper`} elevation={0}>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h6" component="h2" gutterBottom>
              Portfolio At Risk
            </Typography>
          </Grid>
        </Grid>
        {/**
         * /-------------------------------------------------------------------
         * -----------------------   STANDARD RISK ----------------------------
         * --------------------------------------------------------------------
         */}

        <Grid
          container
          spacing={1}
          alignItems="center"
          // style={{ padding: "20px 0px" }}
        >
          <Grid
            item
            xs={12}
            md={3}
            // style={{ marginBottom: "30px" }}
            id="SemiDoughnutHolder"
          >
            <div className="labelholder">
              {cardItems.map((x, i) => {
                return (
                  <div
                    className={x.title}
                    onClick={(e) => {
                      x.clickAction && dispatch(x.clickAction);
                    }}
                    key={i}
                  >
                    <span className="box" style={{ background: x.styles.color }}></span> {x.data}{" "}
                    {x.title}
                  </div>
                );
              })}
              {/* <div className="low">
               <span className="box" style={{background:"#5cc477"}}></span> {portFolioAtRisk.datasets[0].data[0]} low
             </div>
             <div className="medium">
               <span className="box" style={{background:"#ffc800"}}></span> {portFolioAtRisk.datasets[0].data[1]} medium
             </div>
             <div className="high">
               <span className="box" style={{background:"#e26063"}}></span> {portFolioAtRisk.datasets[0].data[2]} high
             </div> */}
            </div>
            {!loading ? (
              <Doughnut data={portFolioAtRisk} options={portFolioAtRiskOptions} />
            ) : (
              <CircularProgress color="primary" />
            )}
          </Grid>
          {cardItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <Grid
                onClick={(e) => {
                  item.action && dispatch(item.action);
                }}
                item
                xs={12}
                md={3}
                key={i}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={4}>
                    <ButtonBase
                      className={classes.image}
                      style={{ ...item.styles }}
                      onClick={item.clickAction}
                    >
                      <Icon />
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="h5" gutterBottom>
                      {item.data} {item.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Risk Profiles
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </PortFolioAtRiskDisplayCardWrapper>
  );
}

export default PortFolioAtRiskDisplayCard;

export const PortFolioAtRiskDisplayCardWrapper = styled.section`
  // padding-bottom: 10px;
  .MuiFormControlLabel-root {
    margin-right: 0;
  }
  #SemiDoughnutHolder {
    height: 140px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .labelholder {
      position: absolute;
      display: flex;
      top: 0;
      div {
        margin-right: 10px;
        cursor: pointer;
      }
      div .box {
        width: 10px;
        height: 10px;
        background: red;
        display: inline-block;
      }
    }
  }
`;
