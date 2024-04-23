import { Dispatch, SetStateAction } from "react"

import { UserInfo, UserRoleEnum } from "@core/types"
import { Visibility } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"

export const initUserForm: Partial<UserInfo> = {
  roles: [UserRoleEnum.REGISTER]
}
export const RolesSpanish = {
  [UserRoleEnum.ADMIN]: "Administrador",
  [UserRoleEnum.REGISTER]: "Registrador",
  [UserRoleEnum.NONE]: "Ninguno"
}
export const initialStateUsersTable = {
  columns: {
    columnVisibilityModel: {
      id: false
    }
  }
}
export const getColumnsUsers: (
  setUserInfoSelected: Dispatch<SetStateAction<UserInfo | undefined>>
) => GridColDef<UserInfo>[] = (setUserInfoSelected) => {
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
      valueGetter: (occupation: UserInfo["occupation"]) => occupation.name || "--",
      headerName: "Ocupación",
      width: 250
    },
    {
      field: "roles",
      headerName: "Rol",
      valueGetter: (roles: UserInfo["roles"]) =>
        roles?.map((role) => RolesSpanish[role]).join(", "),
      width: 250
    },
    {
      field: "_",
      headerName: "Opciones",
      renderCell: (params) => {
        const onClickSeeEvidence = () => setUserInfoSelected(params.row)
        return (
          <IconButton size="small" onClick={onClickSeeEvidence}>
            <Visibility fontSize="small" />
          </IconButton>
        )
      },
      width: 150
    }
  ]
}
