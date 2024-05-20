import { Dispatch, SetStateAction } from "react"

import { UserInfo, UserRoleEnum } from "@core/types"
import { PersonOff, Visibility } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"

export const initUserForm: Partial<UserInfo> = {
  roles: [UserRoleEnum.REGISTER]
}
export const RolesSpanish = {
  [UserRoleEnum.ADMIN]: "Administrador",
  [UserRoleEnum.VISUALIZER]: "Visualizador",
  [UserRoleEnum.REGISTER]: "Registrador",
  [UserRoleEnum.NONE]: "Ninguno"
}
export const initialStateUsersTable = {
  columns: {
    columnVisibilityModel: {
      id: false,
      deletedAt: false
    }
  }
}
export const getColumnsUsers: (
  setUserInfoSelected: Dispatch<SetStateAction<UserInfo | undefined>>,
  setUserDeleted: Dispatch<SetStateAction<UserInfo | undefined>>,
  canWriter: boolean
) => GridColDef<UserInfo>[] = (setUserInfoSelected, setUserDeleted, canWriter) => {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 100
    },
    {
      field: "dni",
      headerName: "DNI",
      width: 150
    },
    {
      field: "name",
      headerName: "Nombres",
      flex: 1
    },
    {
      field: "surname",
      headerName: "Apellidos",
      flex: 1
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1
    },
    {
      field: "phone",
      headerName: "Telefono"
    },
    {
      field: "address",
      headerName: "Dirección"
    },
    {
      field: "occupation",
      valueGetter: (occupation: UserInfo["occupation"]) => occupation?.name || "--",
      headerName: "Ocupación",
      width: 250
    },
    {
      field: "category",
      headerName: "Categoria",
      width: 100
    },
    {
      field: "racsGoals",
      headerName: "Racs",
      width: 100
    },
    {
      field: "roles",
      headerName: "Rol",
      valueGetter: (roles: UserInfo["roles"]) =>
        roles?.map((role) => RolesSpanish[role]).join(", "),
      width: 100
    },
    {
      field: "deletedAt",
      headerName: "Desactivado",
      valueGetter: (deletedAt: UserInfo["deletedAt"]) => deletedAt?.toDate().toLocaleString(),
      width: 100
    },
    {
      field: "_",
      headerName: "Opc.",
      renderCell: (params) => {
        const onClickEdit = () => setUserInfoSelected(params.row)
        const onClickDelete = () => setUserDeleted(params.row)
        const isDisabled = !!params.row.deletedAt
        return (
          <>
            {!isDisabled && (
              <Tooltip title={!canWriter ? "Sin permisos" : "Editar/Restablecer contraseña"}>
                <span>
                  <IconButton disabled={!canWriter} size="small" onClick={onClickEdit}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <Tooltip
              title={
                !canWriter ? "Sin permisos" : isDisabled ? "Activar usuario" : "Desactivar usuario"
              }
            >
              <span>
                <IconButton disabled={!canWriter} size="small" onClick={onClickDelete}>
                  <PersonOff color={isDisabled ? "info" : "action"} fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )
      },
      width: 100
    }
  ]
}
