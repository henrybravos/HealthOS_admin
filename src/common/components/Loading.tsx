import { Grid, LinearProgress, Typography } from "@mui/material"

export const Loading = () => {
  return (
    <Grid
      container
      height="100%"
      flexDirection="row"
      alignContent="center"
      justifyContent="center"
      paddingX={8}
    >
      <LinearProgress style={{ width: "100%" }} />
      <Typography textAlign="center" variant="body1">
        Cargando...
      </Typography>
    </Grid>
  )
}
