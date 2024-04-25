import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { Fragment } from "react/jsx-runtime"

import { useFetchApi } from "@common/hooks"
import { AuthService, RacsService } from "@core/services"
import { UserInfo } from "@core/types"
import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import dayjs from "dayjs"
import { toPng } from "html-to-image"

type MonthYear = string

export type RacsUser = {
  month: string
  userId: string
  racsIds: string[]
  racsGoal: number
  racsQuantity: number
}

type RacsUserReport = {
  user: UserInfo
  months: Record<MonthYear, RacsUser>
}
const getColorPercentage = (percentage: number) => {
  if (percentage >= 67) {
    return "#4caf50"
  }
  if (percentage >= 33) {
    return "#f6a94b"
  }
  return "#fa1100"
}
const getFlexMaxQuantity = (maxQuantity: number, quantity: number) => {
  return quantity / maxQuantity || 0
}
const getPercentage = (racsQuantity?: number, goal?: number) => {
  const quantity = racsQuantity || 0
  let percentage = (quantity / (goal ?? 0)) * 100
  percentage = percentage > 100 ? 100 : percentage
  return percentage || 0
}

const getMonthsBetweenDates = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  const months = []
  let currentDate = startDate.add(1, "month")
  while (currentDate.isBefore(endDate)) {
    months.push(currentDate.format("YYYY-MM"))
    currentDate = currentDate.add(1, "month")
  }
  months.push(endDate.format("YYYY-MM"))
  return months
}
const HomeManagement = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  const currentDate = dayjs()
  const lastYearDate = currentDate.subtract(1, "year")

  const elementContainerRef = useRef<HTMLDivElement>(null)
  const [startDate, setStartDate] = useState(lastYearDate)
  const [endDate, setEndDate] = useState(currentDate)
  const [isLoadingUser, users, fetchUsers] = useFetchApi(AuthService.getAllUsers)
  const [isLoadingRacs, racsReport, fetchRacsUser] = useFetchApi(RacsService.getReportByMonth)
  const monthsFilter = getMonthsBetweenDates(startDate, endDate)

  console.log({ users, racsReport })
  useEffect(() => {
    fetchUsers()
    fetchRacsUser(monthsFilter)
  }, [])

  const htmlToImageConvert = () => {
    if (!elementRef.current || !elementContainerRef.current) return
    const originalWidth = elementRef.current.style.width
    const originalHeight = elementRef.current.style.height

    elementContainerRef.current.style.width = elementRef.current.scrollWidth + 50 + "px"
    elementContainerRef.current.style.height = elementRef.current.scrollHeight + 16 + "px"
    toPng(elementRef.current, {
      cacheBust: false,
      height: elementRef.current.scrollHeight + 16,
      width: elementRef.current.scrollWidth + 50
    })
      .then((dataUrl) => {
        const link = document.createElement("a")
        link.download = "my-image-name.png"
        link.href = dataUrl
        link.click()
        if (elementContainerRef.current) {
          elementContainerRef.current.style.width = originalWidth
          elementContainerRef.current.style.height = originalHeight
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const racsUsers = useMemo(() => {
    const racsUsers: RacsUserReport[] = users?.map((user) => {
      const months: Record<MonthYear, RacsUser> = {}
      monthsFilter.forEach((month) => {
        const racsMonth = racsReport
          ?.find((r) => r.month === month)
          ?.userRacsMonth.find((report) => report.userId === user.id)
        if (racsMonth) {
          months[month] = racsMonth
        } else {
          months[month] = {
            month,
            racsGoal: user.racsGoals || 0,
            racsIds: [],
            racsQuantity: 0,
            userId: user.id
          }
        }
      })
      return {
        user,
        months
      }
    })
    return racsUsers || []
  }, [users, racsReport, monthsFilter])
  return (
    <Grid container>
      <Grid container alignItems="center" justifyContent="space-between" flexDirection="row">
        <h2>Cumplimiento de RACS por colaborador</h2>
        <Grid item>
          <Grid container gap={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  textField: { size: "small" }
                }}
                value={startDate}
                onChange={(date) => date && setStartDate(date)}
                label={"Desde >="}
                views={["month", "year"]}
              />
              <DatePicker
                slotProps={{
                  textField: { size: "small" }
                }}
                value={endDate}
                onChange={(date) => date && setEndDate(date)}
                label={"Hasta <"}
                views={["month", "year"]}
              />
            </LocalizationProvider>
            <Button
              disabled={!startDate || !endDate}
              color="info"
              variant="outlined"
              size="small"
              onClick={() => fetchRacsUser(monthsFilter)}
            >
              BUSCAR
            </Button>
            <Button color="info" variant="contained" size="small" onClick={htmlToImageConvert}>
              DESCARGAR
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid container component={Paper} elevation={4} ref={elementContainerRef}>
        {isLoadingRacs ||
          (isLoadingUser && <LinearProgress variant="indeterminate" style={{ width: "100%" }} />)}

        <TableContainer component={Paper} ref={elementRef}>
          <Table size="small" aria-label="a dense table">
            <TableHead style={{ background: "#bbe5df38" }}>
              <TableRow>
                <TableCell colSpan={4} />
                {monthsFilter.map((month) => (
                  <TableCell style={styles.borderLeft} colSpan={2} key={month} align="center">
                    {month}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>DNI</TableCell>
                <TableCell align="left">COLABORADOR</TableCell>
                <TableCell align="left">CATEGORÍA</TableCell>
                <TableCell align="left">META</TableCell>
                {monthsFilter.map((month) => (
                  <Fragment key={month}>
                    <TableCell style={styles.borderLeft} align="center">
                      #
                    </TableCell>
                    <TableCell style={styles.borderLeft} align="center">
                      %
                    </TableCell>
                  </Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {racsUsers.map(({ user, months }) => {
                const goal = user.racsGoals || 0
                return (
                  <TableRow key={user.id} style={{ minHeight: 30 }}>
                    <TableCell component="th" scope="row">
                      {user.dni}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "200px"
                      }}
                    >
                      {user.name} {user.surname}
                    </TableCell>
                    <TableCell align="left">{user.category || ""}</TableCell>
                    <TableCell align="left">{user.racsGoals || 0}</TableCell>
                    {monthsFilter.map((month) => {
                      const quantity = months[month]?.racsQuantity ?? 0
                      const percentage = getPercentage(quantity, goal)
                      //get max between user with same month
                      const maxRacs = Math.max(
                        ...racsUsers.map((user) => user.months[month]?.racsQuantity || 0)
                      )
                      const maxRacsFlex = getFlexMaxQuantity(maxRacs, quantity)
                      return (
                        <Fragment key={month}>
                          <TableCell
                            size="small"
                            style={styles.borderLeft}
                            width={200}
                            padding="none"
                            align="center"
                          >
                            <Grid container style={{ height: 24, position: "relative" }}>
                              <Grid
                                style={{ ...styles.maxQuantityFlex, ...{ flex: maxRacsFlex } }}
                              />
                              <Grid style={{ flex: 1 - maxRacsFlex, height: "100%" }} />
                              <strong style={styles.quantity}>{quantity}</strong>
                            </Grid>
                          </TableCell>
                          <TableCell
                            size="small"
                            padding="none"
                            width={200}
                            style={styles.borderLeft}
                            align="right"
                          >
                            <Grid container style={styles.percentage}>
                              <Grid
                                style={{
                                  ...styles.circle,
                                  backgroundColor: getColorPercentage(percentage)
                                }}
                              />
                              {percentage.toFixed(0)}%
                            </Grid>
                          </TableCell>
                        </Fragment>
                      )
                    })}
                  </TableRow>
                )
              })}

              <TableRow style={{ background: "#bbe5df38" }}>
                <TableCell align="right" colSpan={4}>
                  <strong>PROMEDIO TOTAL</strong>
                </TableCell>
                {monthsFilter.map((month) => (
                  <Fragment key={month}>
                    <TableCell align="center" style={styles.borderLeft}>
                      <strong>
                        {racsUsers.reduce(
                          (acc, curr) => acc + (curr.months[month]?.racsQuantity || 0),
                          0
                        ) / racsUsers.length}
                      </strong>
                    </TableCell>
                    <TableCell align="right" style={styles.borderLeft} padding="none">
                      {(
                        racsUsers.reduce(
                          (acc, curr) =>
                            acc +
                            getPercentage(curr.months[month]?.racsQuantity, curr.user.racsGoals),
                          0
                        ) / racsUsers.length
                      ).toFixed(0)}
                      %
                    </TableCell>
                  </Fragment>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
export default HomeManagement
const styles: Record<string, CSSProperties> = {
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftStyle: "solid"
  },
  percentage: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderColor: "#000",
    borderWidth: 1,
    borderStyle: "solid"
  },
  quantity: {
    width: "100%",
    textAlign: "center",
    verticalAlign: "middle",
    top: "50%",
    transform: "translateY(-50%)",
    position: "absolute"
  },
  maxQuantityFlex: {
    height: "100%",
    background:
      "linear-gradient(70deg, rgba(72,205,255,1) 0%, rgba(72,205,255,1) 20%, rgba(191,240,250,0.5) 90%)",
    border: "1px solid #48cdff",
    opacity: 0.8
  }
}
