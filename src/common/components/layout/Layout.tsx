import { useEffect, useState } from "react"

import { LOCAL_STORAGE } from "@common/constants"
import { useAppContext } from "@context/useAppContext"
import { Face, Menu as MenuIcon } from "@mui/icons-material"
import {
  Box,
  CssBaseline,
  Grid,
  IconButton,
  Link,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  Typography,
  styled,
  useTheme
} from "@mui/material"

import { Menu } from "./Menu"

export const drawerWidth: number = 240
export function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © development by "}
      <Link color="inherit" href="#">
        NOATUM
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  )
}
interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))
interface ILayout {
  children: React.ReactNode
  title: string
}

export const Layout = ({ children, title }: ILayout) => {
  const { userInfo } = useAppContext()
  LOCAL_STORAGE
  const [openDrawer, setOpenDrawer] = useState(
    localStorage.getItem(LOCAL_STORAGE.DRAWER_OPEN) === "true"
  )
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer)
    localStorage.setItem(LOCAL_STORAGE.DRAWER_OPEN, !openDrawer + "")
  }
  const {
    palette: { text }
  } = useTheme()

  useEffect(() => {
    document.title = title
  }, [title])
  return (
    <Box sx={{ display: "flex" }} height="100%">
      <CssBaseline />
      <AppBar position="absolute" color="primary" open={openDrawer}>
        <Toolbar
          sx={{
            pr: "24px" // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(openDrawer && { display: "none" })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} />

          <IconButton color="inherit">
            <Face color="inherit" />
            <Box flexDirection={"column"} alignItems="flex-start" display="flex" paddingLeft={1}>
              <Typography component="p" variant="body2" color={text.secondary} fontWeight="bold">
                {userInfo?.name || ""} {userInfo?.surname || ""}
              </Typography>
              <Typography component="p" variant="body2" color={text.secondary}>
                {userInfo?.email || ""}
              </Typography>
            </Box>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu open={openDrawer} toggleDrawer={toggleDrawer} />
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            minHeight: "95vh"
          }}
        >
          <Toolbar />
          <Grid container justifyContent="center">
            <Grid item container marginTop={2} className={openDrawer ? "main-open" : "main-close"}>
              {children}
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: "3vh",
            overflow: "auto"
          }}
        >
          <Copyright />
        </Box>
      </Box>
    </Box>
  )
}
