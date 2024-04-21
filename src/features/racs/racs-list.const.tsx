import { Dispatch, SetStateAction } from "react"

import { Racs } from "@core/types"
import { Visibility } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"

export const getColumnsRacs: (
  setRacsSelected: Dispatch<SetStateAction<Racs | undefined>>
) => GridColDef<Racs>[] = (setRacsSelected) => {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 100
    },
    {
      field: "openAt",
      valueGetter: (openAt: Racs["openAt"]) => openAt.toDate().toLocaleString(),
      headerName: "Fecha de creación",
      width: 150
    },
    {
      field: "closeAt",
      valueGetter: (closeAt: Racs["closeAt"]) => closeAt?.toDate().toLocaleString() || "--",
      headerName: "Fecha de cierre",
      width: 150
    },
    {
      field: "user",
      headerName: "Usuario",
      valueGetter: (user: Racs["user"]) => `${user?.name || ""} ${user?.surname || ""}`,
      width: 200
    },
    {
      field: "place",
      headerName: "Lugar",
      valueGetter: (place: Racs["place"]) => place?.name || "--",
      width: 150
    },

    {
      field: "company",
      headerName: "Empresa",
      valueGetter: (company: Racs["company"]) => company?.name || "--",
      width: 150
    },
    {
      field: "type",
      headerName: "Tipo",
      width: 150
    },
    {
      field: "act",
      headerName: "Acto",
      valueGetter: (act: Racs["act"]) => act?.name || "--"
    },
    {
      field: "condition",
      headerName: "Condición",
      valueGetter: (condition: Racs["condition"]) => condition?.name || "--"
    },
    {
      field: "description",
      headerName: "Descripción",
      flex: 1
    },
    {
      field: "controlCondition",
      headerName: "Control",
      valueGetter: (controlCondition: Racs["controlCondition"]) => controlCondition || "--",
      flex: 1
    },
    {
      field: "status",
      headerName: "Estado"
    },
    {
      field: "evidence",
      headerName: "Evidencia",
      renderCell: (params) => {
        const evidence = params.value as Racs["evidence"]
        const onClickSeeEvidence = () => setRacsSelected(params.row)

        return (
          <>
            {evidence.openUri && (
              <a href={evidence.openUri} target="_blank" rel="noreferrer">
                Abierta{" "}
              </a>
            )}

            {evidence.closeUri && (
              <a href={evidence.closeUri} target="_blank" rel="noreferrer">
                Cierre
              </a>
            )}
            <IconButton size="small" onClick={onClickSeeEvidence}>
              <Visibility fontSize="small" />
            </IconButton>
          </>
        )
      },
      width: 150
    }
  ]
}
