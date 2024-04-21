import { Copyright } from "@common/components/layout"
import { COLORS } from "@common/constants"
import { useLogin } from "@features/login/hooks"
import { AlternateEmail, LockOutlined, Password } from "@mui/icons-material"
import {
  Alert,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

const defaultTheme = createTheme()

export default function LoginManagement() {
  const ctxLogin = useLogin()
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: COLORS.PRIMARY,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box marginTop={4} />
          <Typography color="Background" fontWeight="bold" component="h1" variant="h4">
            Sistema de Seguridad y Salud Ocupacional
          </Typography>
        </Grid>
        <Grid
          item
          display="flex"
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          alignItems="center"
          justifyContent="center"
          elevation={6}
          square
        >
          <Box display="flex" marginY={8} marginX={4} alignItems="center" flexDirection="column">
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Bienvenido
            </Typography>
            <Typography component="span" variant="body1">
              Iniciar sesión con tus credenciales
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={ctxLogin.email}
                onChange={ctxLogin.onChangeEmail}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                value={ctxLogin.password}
                autoComplete="current-password"
                onChange={ctxLogin.onChangePassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Password fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                disabled={ctxLogin.loadingAuth}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={ctxLogin.submitAuth}
              >
                Ingresar
              </Button>
              {ctxLogin.error && <Alert severity="error">Error en las credenciales/usuario</Alert>}
              <Copyright />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
