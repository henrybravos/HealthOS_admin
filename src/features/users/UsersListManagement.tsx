import { useEffect, useState } from "react"

import { Datagrid } from "@common/components"
import { useFetchApi } from "@common/hooks"
import { AuthService } from "@core/services"
import { UserInfo } from "@core/types"
import UserForm from "@features/users/UserForm"
import { Button, Grid, Paper } from "@mui/material"

import { getColumnsUsers } from "./users-list.const"

const UserListManagement = () => {
  const [userSelected, setUserSelected] = useState<UserInfo>()
  const [isLoadingUsers, users, fetchUsers] = useFetchApi(AuthService.getAllUsers)

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCloseCreateOrUpdate = () => {
    setUserSelected(undefined)
  }
  const handleOpenCreate = () => {
    if (userSelected) {
      handleCloseCreateOrUpdate()
    } else {
      setUserSelected({} as UserInfo)
    }
  }
  return (
    <Grid container>
      <Grid container padding={1} justifyContent="flex-end">
        <Button variant="outlined" size="small" onClick={handleOpenCreate}>
          {userSelected ? "CERRAR" : "CREAR"}
        </Button>
      </Grid>
      <Grid item md={userSelected ? 8 : 12} padding={1}>
        <Grid container component={Paper}>
          <Datagrid
            loading={isLoadingUsers}
            columns={getColumnsUsers(setUserSelected)}
            disableRowSelectionOnClick
            rows={users ?? []}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false
                }
              }
            }}
          />
        </Grid>
      </Grid>
      <Grid
        item
        md={userSelected ? 4 : 0}
        padding={1}
        style={{
          display: userSelected ? "block" : "none"
        }}
      >
        <UserForm
          fetchUsers={fetchUsers}
          handleCloseForm={handleCloseCreateOrUpdate}
          userEdit={userSelected}
        />
      </Grid>
    </Grid>
  )
}
export default UserListManagement
