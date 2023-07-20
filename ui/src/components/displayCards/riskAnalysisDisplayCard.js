import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
// import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import { useDispatch } from "react-redux";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
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
// const colorList = [];
function RiskAnalysisDisplayCard({
  cardItems,
  riskAnalysis,
  title,
  weightage,
  standardRisk,
  riskscoreSetter,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [standard, setStandard] = useState(null);
  // const [weightedRisk, setWeightedRisk] = useState(null);
  const [weights, setWeights] = useState({
    performance_risk: null,
    financial_risk: null,
    quality_risk: null,
    compliance_risk: null,
  });
  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };
  useEffect(() => {
    setStandard(riskAnalysis);
    setWeights({
      performance_risk: weightage["Performance Risk"],
      financial_risk: weightage["Financial Risk"],
      quality_risk: weightage["Quality Risk"],
      compliance_risk: weightage["Complaince Risk"],
    });
  }, []);

  useEffect(() => {
    if (checked) {
      const totwei = Object.values(weights).reduce(
        (a, b) => parseInt(a) + parseInt(b === "" ? 0 : b),
        0
      );
      const totalweight = totwei === 0 ? 1 : totwei;
      const totalRisk = Object.keys(weights).reduce((acc, val) => {
        return (
          acc +
          (weights[val] === ""
            ? 0
            : parseInt(weights[val]) * parseInt(riskAnalysis[val]))
        );
      }, 0);
      riskscoreSetter(totalRisk / totalweight);
    } else {
      riskscoreSetter(standardRisk);
    }
  }, [weights, checked]);

  const weightChangeHandler = (e) => {
    const { name, value } = e.target;
    setWeights((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  return (
    <RiskAnalysisDisplayCardWrapper>
      <Paper className={`${classes.paper} custompaper`} elevation={0}>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h6" component="h2" gutterBottom>
              {title
                ? "Risk Analysis - " +
                  title
                    .split("  ")
                    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                    .join(" ")
                : "Risk Analysis"}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Grid
              container
              spacing={2}
              className="togglerHolder"
              justify="space-around"
            >
              <Grid item>standard</Grid>
              <Grid item>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={checked}
                        onChange={toggleChecked}
                      />
                    }
                  />
                </FormGroup>
              </Grid>
              <Grid item>Weighted</Grid>
            </Grid>
          </Grid>
        </Grid>
        {/**
         * /-------------------------------------------------------------------
         * -----------------------   STANDARD RISK ----------------------------
         * --------------------------------------------------------------------
         */}
        {standard && !checked && (
          <Grid
            container
            spacing={6}
            alignItems="center"
            style={{ padding: "20px 0px" }}
          >
            {cardItems.map((item, i) => {
              const Icon = item.icon;
              const riskScore = standard[item.key];

              return (
                <Grid
                  onClick={(e) => {
                    item.action && dispatch(item.action);
                  }}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={i}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={4}>
                      <ButtonBase
                        className={classes.image}
                        style={{ ...item.styles }}
                      >
                        <Icon />
                      </ButtonBase>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h5" gutterBottom>
                        {riskScore} %
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {item.title}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        )}
        {/**
         * /-------------------------------------------------------------------
         * -----------------------   WEIGHTED RISK ----------------------------
         * --------------------------------------------------------------------
         */}
        {standard && checked && (
          <div>
            <Grid
              container
              spacing={6}
              alignItems="center"
              style={{ padding: "20px 0px" }}
            >
              {cardItems.map((item, i) => {
                const Icon = item.icon;
                const riskScore = parseInt(standard[item.key] || 0);

                return (
                  <Grid
                    onClick={(e) => {
                      item.action && dispatch(item.action);
                    }}
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={i}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={4}>
                        <ButtonBase
                          className={classes.image}
                          style={{ ...item.styles }}
                        >
                          <Icon />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="h5" gutterBottom>
                          {riskScore} %
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {item.title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
            <Grid
              container
              spacing={6}
              alignItems="center"
              style={{ padding: "20px 0px" }}
            >
              {Object.keys(weights).map((risk, i) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={4}>
                        weight
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          label={risk.split("_").join(" ")}
                          name={risk}
                          value={weights[risk]}
                          onChange={weightChangeHandler}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        )}
      </Paper>
    </RiskAnalysisDisplayCardWrapper>
  );
}

export default RiskAnalysisDisplayCard;

export const RiskAnalysisDisplayCardWrapper = styled.section`
  .MuiFormControlLabel-root {
    margin-right: 0;
  }
  .togglerHolder {
    background: #efecfd;
    border-radius: 20px;
    width: 100%;
  }
`;
