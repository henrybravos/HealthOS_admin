import { useState } from "react"

import { Datagrid } from "@common/components"
import { DialogComponent } from "@common/components"
import { useFetchApi } from "@common/hooks"
import { RacsService } from "@core/services"
import { Racs } from "@core/types"
import { Grid, Paper, Typography } from "@mui/material"

import { getColumnsRacs } from "./racs-list.const"

export const RacsListManagement = () => {
  const [racsSelected, setRacsSelected] = useState<Racs>()
  const [loadingRacs, rows, fetchRacs] = useFetchApi(RacsService.getRacsPagination)
  const handleCloseDialog = () => setRacsSelected(undefined)
  return (
    <Grid container component={Paper}>
      <Datagrid
        rows={rows?.data ?? []}
        loading={loadingRacs}
        columns={getColumnsRacs(setRacsSelected)}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false
            }
          }
        }}
        paginationMode="server"
        rowCount={rows?.totalSize ?? 0}
        fetchServer={fetchRacs}
      />
      <DialogComponent
        handleCloseDialog={handleCloseDialog}
        open={!!racsSelected}
        title="Evidencias"
      >
        {racsSelected?.evidence.openUri && (
          <>
            <Typography variant="h6">Evidencia de apertura</Typography>
            <img width={500} height={400} src={racsSelected?.evidence.openUri} />
          </>
        )}
        {racsSelected?.evidence.closeUri && (
          <>
            <Typography variant="h6">Evidencia de cierre</Typography>
            <img width={500} height={400} src={racsSelected?.evidence.closeUri} />
          </>
        )}
      </DialogComponent>
    </Grid>
  )
}
