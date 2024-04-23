import { useEffect, useState } from "react"

import { Datagrid } from "@common/components"
import { useFetchApi } from "@common/hooks"
import { AuthService } from "@core/services"
import { UserInfo } from "@core/types"
import { Button, Grid, Paper } from "@mui/material"

import UserFormComponent from "./UserFormComponent"
import { getColumnsUsers, initUserForm, initialStateUsersTable } from "./users-list.const"

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
      setUserSelected(initUserForm as UserInfo)
    }
  }
  const styleDisplayForm = {
    display: userSelected ? "block" : "none"
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
            initialState={initialStateUsersTable}
          />
        </Grid>
      </Grid>
      <Grid item md={userSelected ? 4 : 0} padding={1} style={styleDisplayForm}>
        <UserFormComponent
          fetchUsers={fetchUsers}
          handleCloseForm={handleCloseCreateOrUpdate}
          userEdit={userSelected}
        />
      </Grid>
    </Grid>
  )
}
export default UserListManagement
