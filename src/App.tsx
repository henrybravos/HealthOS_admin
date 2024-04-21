import { RouterProvider } from "react-router-dom"

import { COLORS } from "@common/constants"
import { ThemeProvider, createTheme } from "@mui/material/styles"

import { AppProvider } from "./context"
import { AppRoute } from "./routes"

import "./assets/app.css"

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY
    },
    secondary: {
      main: COLORS.SECONDARY
    }
  }
})
function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppProvider>
        <AppRoute />
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
