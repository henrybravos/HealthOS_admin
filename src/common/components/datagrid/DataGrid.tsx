import { useEffect, useState } from "react"

import {
  DataGrid,
  DataGridProps,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarExport
} from "@mui/x-data-grid"

import {
  INITIAL_STATE_DATAGRID,
  LOCALE_TEXT_DATA_GRID,
  PAGE_SIZE_OPTIONS,
  SLOPS_TEXT_DATA_GRID
} from "./data-grid.const"

function ExportCsv() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}
type PaginationModel = {
  page: number
  pageSize: number
}

const initialModelPagination: PaginationModel = {
  page: 0,
  pageSize: 12
}
export type ModePagination = "after" | "before" | "start"
type DataGridCustomProps = {
  fetchServer?: (params: { pageSize: number; mode: ModePagination; documentId?: string }) => void
  clearSelectRowCallback?: () => void
} & DataGridProps
const DataGridComponent = (props: DataGridCustomProps) => {
  const [paginationModel, setPaginationModel] = useState(initialModelPagination)
  useEffect(() => {
    handlePageChange(initialModelPagination)
  }, [])
  const handlePageChange = ({ page, pageSize }: PaginationModel) => {
    let startAfterBeforeId: string | undefined = ""
    let mode: "start" | "before" | "after" = "start"
    if (pageSize !== paginationModel.pageSize) {
      mode = "start"
    } else if (page > paginationModel.page) {
      const lastRow = props.rows?.[props.rows.length - 1]
      startAfterBeforeId = lastRow?.id
      mode = "after"
    } else {
      const firstRow = props.rows?.[0]
      startAfterBeforeId = firstRow?.id
      mode = "before"
    }
    props.fetchServer?.({
      pageSize,
      mode,
      documentId: startAfterBeforeId
    })
    setPaginationModel({ page, pageSize })
  }
  const ifNotSelectThenRemove = (rows: GridRowSelectionModel) =>
    rows.length === 0 && props.clearSelectRowCallback && props.clearSelectRowCallback()

  return (
    <DataGrid
      {...props}
      pagination
      density="compact"
      hideFooterSelectedRowCount
      slotProps={SLOPS_TEXT_DATA_GRID}
      paginationModel={paginationModel}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      localeText={LOCALE_TEXT_DATA_GRID}
      onPaginationModelChange={handlePageChange}
      slots={{ toolbar: ExportCsv }}
      onRowSelectionModelChange={ifNotSelectThenRemove}
      initialState={{ ...props.initialState, ...INITIAL_STATE_DATAGRID }}
    />
  )
}
export default DataGridComponent
