import React from "react"

import { Close } from "@mui/icons-material"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography
} from "@mui/material"

export interface IDialogComponent extends Omit<DialogProps, "ref"> {
  title: string
  agreeText?: string
  disagreeText?: string
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  handleCloseDialog?: () => void
  onAgreeDialog?: () => void
  loadingAgreeButton?: boolean
  setLoadingAgreeButton?: React.Dispatch<React.SetStateAction<boolean>>
  disableAgreeButton?: boolean
  disableActions?: boolean
}

const DialogComponent = (props: IDialogComponent) => {
  const {
    title,
    setOpen,
    onAgreeDialog,
    disagreeText = "Cancelar",
    agreeText = "Aceptar",
    loadingAgreeButton: loadingAgreeButton,
    setLoadingAgreeButton: setLoadingAgreeButton,
    disableAgreeButton = false,
    disableActions = false,
    handleCloseDialog,
    ...dialogProps
  } = props

  const handleClose = () => {
    if (setOpen) setOpen(false)
    if (handleCloseDialog) handleCloseDialog()
    if (setLoadingAgreeButton) setLoadingAgreeButton(false)
  }

  return (
    <React.Fragment>
      <Dialog
        {...dialogProps}
        className="dts-dialog"
        open={dialogProps.open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle component={Box} className="title-container">
          <Grid container justifyContent="space-between">
            <Typography className="title" variant="h6" noWrap color="primary.main">
              {title}
            </Typography>
            <IconButton size="medium" onClick={handleClose}>
              <Close fontSize="medium" />
            </IconButton>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>{props.children}</DialogContent>
        {!disableActions && (
          <DialogActions className="actions-container">
            <Button
              id="disagree-button"
              className="button-disagree"
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              <Typography className="text-disagree">{disagreeText}</Typography>
            </Button>
            <Button
              variant="contained"
              onClick={onAgreeDialog}
              autoFocus
              color="primary"
              disabled={disableAgreeButton}
              aria-disabled={disableAgreeButton}
            >
              <Typography className="text-agree">{agreeText}</Typography>
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  )
}

export { DialogComponent }
