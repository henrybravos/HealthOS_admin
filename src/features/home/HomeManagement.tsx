import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { Fragment } from "react/jsx-runtime"

import { getMonthsBetweenDates } from "@common/helpers"
import { useFetchApi } from "@common/hooks"
import { AuthService, RacsService } from "@core/services"
import { MonthYear, RacsUser, RacsUserReport, UserInfo } from "@core/types"
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

const TableHeaderRacs = ({ months }: { months: string[] }) => {
  return (
    <TableHead style={{ background: "#bbe5df38" }}>
      <TableRow>
        <TableCell colSpan={4} />
        {months.map((month) => (
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
        {months.map((month) => (
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
  )
}
type HomeManagementProps = {
  dateStart: dayjs.Dayjs
  dateEnd: dayjs.Dayjs
  months: string[]
  containerRef: React.RefObject<HTMLDivElement>
  divReportRef: React.RefObject<HTMLDivElement>
  setDateStart: (date: dayjs.Dayjs) => void
  setDateEnd: (date: dayjs.Dayjs) => void
  fetchRacsUser: (months: string[]) => void
}
const HeaderHome = ({
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  fetchRacsUser,
  months,
  divReportRef,
  containerRef
}: HomeManagementProps) => {
  const htmlToImageConvert = () => {
    if (!divReportRef.current || !containerRef.current) return
    const originalWidth = divReportRef.current.style.width
    const originalHeight = divReportRef.current.style.height

    containerRef.current.style.width = divReportRef.current.scrollWidth + 50 + "px"
    containerRef.current.style.height = divReportRef.current.scrollHeight + 16 + "px"
    toPng(divReportRef.current, {
      cacheBust: false,
      height: divReportRef.current.scrollHeight + 16,
      width: divReportRef.current.scrollWidth + 50
    })
      .then((dataUrl) => {
        const link = document.createElement("a")
        link.download = "my-image-name.png"
        link.href = dataUrl
        link.click()
        if (containerRef.current) {
          containerRef.current.style.width = originalWidth
          containerRef.current.style.height = originalHeight
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Grid container gap={1}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          slotProps={{
            textField: { size: "small" }
          }}
          value={dateStart}
          onChange={(date) => date && setDateStart(date)}
          label={"Desde >="}
          views={["day", "month", "year"]}
        />
        <DatePicker
          slotProps={{
            textField: { size: "small" }
          }}
          value={dateEnd}
          onChange={(date) => date && setDateEnd(date)}
          label={"Hasta <"}
          views={["day", "month", "year"]}
        />
      </LocalizationProvider>
      <Button
        disabled={!dateStart || !dateEnd}
        color="info"
        variant="outlined"
        size="small"
        onClick={() => fetchRacsUser(months)}
      >
        BUSCAR
      </Button>
      <Button color="info" variant="contained" size="small" onClick={htmlToImageConvert}>
        DESCARGAR
      </Button>
    </Grid>
  )
}
const TableRowRacs = ({
  user,
  monthsUser,
  monthsFilter,
  racsUsers
}: {
  user: UserInfo
  monthsUser: Record<MonthYear, RacsUser>
  monthsFilter: string[]
  racsUsers: RacsUserReport[]
}) => {
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
        const quantity = monthsUser[month]?.racsQuantity ?? 0
        const percentage = getPercentage(quantity, goal)
        const maxRacs = Math.max(...racsUsers.map((user) => user.months[month]?.racsQuantity || 0))
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
                <Grid style={{ ...styles.maxQuantityFlex, ...{ flex: maxRacsFlex } }} />
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
                {percentage.toFixed(1)}%
              </Grid>
            </TableCell>
          </Fragment>
        )
      })}
    </TableRow>
  )
}
const HomeManagement = () => {
  const elementReportRef = useRef<HTMLDivElement>(null)
  const currentDate = dayjs()
  const lastYearDate = currentDate.subtract(1, "year")
  const elementContainerRef = useRef<HTMLDivElement>(null)
  const [dateStart, setDateStart] = useState(lastYearDate)
  const [dateEnd, setDateEnd] = useState(currentDate)
  const [isLoadingUser, users, fetchUsers] = useFetchApi(AuthService.getAllUsers)
  const [monthsFilter, setMonthsFilter] = useState<string[]>(
    getMonthsBetweenDates(dateStart, dateEnd)
  )
  const [isLoadingRacs, racsReport, fetchRacsUser] = useFetchApi(RacsService.getRacsBetweenDates)

  useEffect(() => {
    fetchUsers()
    fetchRacsUser({
      dateEnd,
      dateStart
    })
  }, [])

  const racsUsers = useMemo(() => {
    const racsUsers: RacsUserReport[] = users?.map((user) => {
      const months: Record<MonthYear, RacsUser> = {}
      monthsFilter.forEach((month) => {
        if (!racsReport) return
        const racsUser = racsReport[month]?.filter((rac) => rac.user.id === user.id) || []
        months[month] = {
          month,
          racsQuantity: racsUser.length,
          racsGoal: user.racsGoals || 0,
          racsIds: racsUser.map((rac) => rac.id),
          userId: user.id
        }
      })
      return {
        user,
        months
      }
    })
    return racsUsers || []
  }, [users, racsReport, monthsFilter])
  const handleFetchRacsUser = async () => {
    await fetchRacsUser({
      dateEnd,
      dateStart
    })
    setMonthsFilter(getMonthsBetweenDates(dateStart, dateEnd))
  }
  const getAverageMonth = (month: string) => {
    const average =
      racsUsers.reduce((acc, curr) => acc + (curr.months[month]?.racsQuantity || 0), 0) /
      racsUsers.length
    return average || 0
  }
  const getPercentageMonth = (month: string) => {
    const percentage =
      racsUsers.reduce(
        (acc, curr) => acc + getPercentage(curr.months[month]?.racsQuantity, curr.user.racsGoals),
        0
      ) / racsUsers.length
    return percentage || 0
  }
  return (
    <Grid container>
      <Grid container alignItems="center" justifyContent="space-between" flexDirection="row">
        <h2>Cumplimiento de RACS por colaborador</h2>
        <Grid item>
          <HeaderHome
            dateEnd={dateEnd}
            dateStart={dateStart}
            months={monthsFilter}
            setDateEnd={setDateEnd}
            setDateStart={setDateStart}
            divReportRef={elementReportRef}
            containerRef={elementContainerRef}
            fetchRacsUser={handleFetchRacsUser}
          />
        </Grid>
      </Grid>

      <Grid container component={Paper} elevation={4} ref={elementContainerRef}>
        {(isLoadingRacs || isLoadingUser) && (
          <LinearProgress variant="indeterminate" style={{ width: "100%" }} />
        )}

        <TableContainer component={Paper} ref={elementReportRef}>
          <Table size="small" aria-label="a dense table">
            <TableHeaderRacs months={monthsFilter} />
            <TableBody>
              {racsUsers.map(({ user, months }) => (
                <TableRowRacs
                  key={user.id}
                  {...{ user, months, monthsFilter, racsUsers, monthsUser: months }}
                />
              ))}
              <TableRow style={{ background: "#bbe5df38", minHeight: 50 }}>
                <TableCell align="right" colSpan={4}>
                  <strong>PROMEDIO TOTAL</strong>
                </TableCell>
                {monthsFilter.map((month) => (
                  <Fragment key={month}>
                    <TableCell align="center" style={styles.borderLeft}>
                      <strong>{getAverageMonth(month).toFixed(1)}</strong>
                    </TableCell>
                    <TableCell align="right" style={styles.borderLeft} padding="none">
                      {getPercentageMonth(month).toFixed(1)}%
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
