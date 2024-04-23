import { useEffect, useState } from "react"

import { Datagrid, DialogComponent } from "@common/components"
import { useFetchApi } from "@common/hooks"
import { AuthService } from "@core/services"
import { UserInfo } from "@core/types"
import { Button, Grid, Paper, Typography } from "@mui/material"

import UserFormComponent from "./UserFormComponent"
import { getColumnsUsers, initUserForm, initialStateUsersTable } from "./users-list.const"

const UserListManagement = () => {
  const [userDeleted, setUserDeleted] = useState<UserInfo>()
  const [userSelected, setUserSelected] = useState<UserInfo>()
  const [isLoadingUsers, users, fetchUsers] = useFetchApi(AuthService.getAllUsers)
  const [isLoadingDeleted, responseActiveDisable, fetchActiveDisableUser, errorActiveDisable] =
    useFetchApi(AuthService.activeOrDisabledUser)
  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (responseActiveDisable) {
      fetchUsers()
      setUserDeleted(undefined)
    }
  }, [responseActiveDisable])
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
  const handleCloseDialogDeleted = () => {
    setUserDeleted(undefined)
  }
  const handleDeleteOrActiveSoft = () => {
    if (!userDeleted) return
    fetchActiveDisableUser({ user: userDeleted })
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
            columns={getColumnsUsers(setUserSelected, setUserDeleted)}
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
      <DialogComponent
        maxWidth="xs"
        open={!!userDeleted?.id}
        title={userDeleted?.deletedAt ? "Activar usuario" : "Desactivar usuario"}
        handleCloseDialog={handleCloseDialogDeleted}
        loadingAgreeButton={isLoadingDeleted}
        handleAgreeDialog={handleDeleteOrActiveSoft}
      >
        <Typography variant="h5">
          {userDeleted?.name} {userDeleted?.surname} - {userDeleted?.dni}
        </Typography>
        {errorActiveDisable && (
          <Typography variant="h6" color="error">
            {errorActiveDisable}
          </Typography>
        )}
      </DialogComponent>
    </Grid>
  )
}
export default UserListManagement
