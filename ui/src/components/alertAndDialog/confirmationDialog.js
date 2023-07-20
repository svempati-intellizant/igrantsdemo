import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ConfirmationDialog({
  dialogShow,
  title,
  content,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonHandler,
  secondaryButtonHandler,
}) {
  // const primaryHandler = () => {
  //   primaryButtonHandler();
  // };
  // const secondaryHandler = () => {
  //   secondaryButtonHandler();
  // };
  return (
    <div>
      <Dialog
        open={dialogShow}
        onClose={secondaryButtonHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={secondaryButtonHandler} color="secondary">
            {secondaryButtonText}
          </Button>
          <Button onClick={primaryButtonHandler} color="primary">
            {primaryButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
