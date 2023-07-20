import React from "react";
import styled from "styled-components";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    // "&:hover": {
    //   border: `1px solid ${theme.palette.primary.main}`,
    // },
    border: `1px solid #221c69`,
    height: "100%",
  },
  paperTitle: {
    color: theme.palette.text.secondary,
  },
  paperValue: {
    color: theme.palette.text.primary,
  },
}));

function OverviewDisplayCard({ cardItems }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  return (
    <OverviewDisplayCardWrapper color={theme.palette}>
      <Grid container spacing={3} justify="space-around">
        {cardItems.map((item, i) => (
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
            <Paper
              className={`${classes.paper} custompaper ${item.isactive && 'activeItem'}`}
              elevation={0}
              variant="outlined"
              style={item.action && { cursor: "pointer" }}
            >
              <h5 className={`paperTitle`}>{item.title}</h5>
              <h1 className={`paperValue`}>{item.value}</h1>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </OverviewDisplayCardWrapper>
  );
}

export default OverviewDisplayCard;

export const OverviewDisplayCardWrapper = styled.section`
  padding-bottom: 50px;
  .paperTitle {
    font-size: 19px;
    margin: 10px 0px;
    color: ${(props) => props.color.text.secondary};
  }
  .paperValue {
    font-size: 40px;
    margin: 10px 0px;
    font-weight: 500;
    color: ${(props) => props.color.text.main};
  }
  .custompaper {
    position: relative;
    z-index: 2;
    cursor: default;
    &:hover {
      .paperTitle,
      .paperValue {
        color: ${(props) => props.color.primary.main} !important;
      }
    }
  }
  .activeItem{
    .paperTitle,
    .paperValue {
      color: ${(props) => props.color.primary.main} !important;
    }
  }
`;
