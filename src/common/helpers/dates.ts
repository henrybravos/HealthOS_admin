import dayjs from "dayjs"

export const getMonthsBetweenDates = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
  if (startDate.isAfter(endDate)) return []
  const months = []
  let currentDate = startDate.startOf("month") // Iniciar en el primer día del mes de inicio
  while (!currentDate.isSame(endDate, "month")) {
    months.push(currentDate.format("YYYY-MM"))
    currentDate = currentDate.add(1, "month")
  }
  const endMonth = endDate.format("YYYY-MM")
  if (!months.includes(endMonth)) months.push(endMonth)
  return months.reverse()
}
