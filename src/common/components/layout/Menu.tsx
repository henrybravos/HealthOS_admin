import { Fragment } from "react"
import { Link, useLocation } from "react-router-dom"

import { PATHS, VERSION_APP } from "@common/constants"
import { useAppContext } from "@context/useAppContext"
import { ChevronLeft, Dashboard, Grading, Logout, People } from "@mui/icons-material"
import { Divider, IconButton, List, Toolbar, Tooltip, Typography } from "@mui/material"
import { ListItemButton, ListItemIcon, ListItemText, Drawer as MuiDrawer } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { styled } from "@mui/material/styles"

import { drawerWidth } from "./Layout"

interface IMenu {
  toggleDrawer: () => void
  open: boolean
}

const MainListItems = () => {
  const { pathname } = useLocation()

  const isSelect = (path: string) => pathname === path
  const linkCss = { textDecoration: "none", color: "rgba(0, 0, 0, 0.87)" }
  return (
    <Fragment>
      <Link to={PATHS.HOME} style={linkCss}>
        <Tooltip title="Inicio" placement="right">
          <ListItemButton selected={isSelect(PATHS.HOME)}>
            <ListItemIcon>
              <Dashboard color="primary" />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link to={PATHS.RACS} style={linkCss}>
        <Tooltip title="Registros RACS" placement="right">
          <ListItemButton selected={isSelect(PATHS.RACS)}>
            <ListItemIcon>
              <Grading color="primary" />
            </ListItemIcon>
            <ListItemText primary="RACS" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link to={PATHS.USERS} style={linkCss}>
        <Tooltip title="Usuarios" placement="right">
          <ListItemButton selected={isSelect(PATHS.USERS)}>
            <ListItemIcon>
              <People color="primary" />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItemButton>
        </Tooltip>
      </Link>
    </Fragment>
  )
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
      }
    })
  }
}))
export const Menu = ({ open, toggleDrawer }: IMenu) => {
  const theme = useTheme()
  const { handleSignOut } = useAppContext()
  return (
    <Drawer variant="permanent" open={open} style={{ display: "flex", alignItems: "center" }}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1]
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav" style={{ flex: 1 }}>
        <MainListItems />
      </List>
      <ListItemButton style={{ flex: 0 }} onClick={handleSignOut}>
        <ListItemIcon>
          <Logout color="primary" />
        </ListItemIcon>
        <ListItemText primary="Salir" />
      </ListItemButton>
      <Typography
        style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main }}
        textAlign="center"
        fontSize={12}
      >
        {VERSION_APP}
      </Typography>
    </Drawer>
  )
}
