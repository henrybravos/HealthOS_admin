import { ChangeEvent, useEffect, useState } from "react"

import { useFetchApi } from "@common/hooks"
import { AuthService, OccupationService } from "@core/services"
import { Occupation, UserInfo } from "@core/types"
import { Email } from "@mui/icons-material"
import {
  Alert,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material"

type UserFormParams = {
  userEdit?: UserInfo
  fetchUsers: () => void
  handleCloseForm: () => void
}

const UserForm = (params: UserFormParams) => {
  const [password, setPassword] = useState("")
  const [userForm, setUserForm] = useState<Partial<UserInfo>>()
  const [isLoadingOccupation, occupations, fetchOccupations] = useFetchApi(
    OccupationService.getAllOccupations
  )
  const [isLoadingReset, responseResetPassword, fetchReset, errorReset, resetFetchPassword] =
    useFetchApi(AuthService.sendPasswordResetEmail)
  const [
    isLoadingCreateUpdate,
    createUpdateResponse,
    fetchCreateUpdate,
    errorCreateUpdate,
    resetCreateUpdate
  ] = useFetchApi(AuthService.createOrUpdateUser)
  useEffect(() => {
    fetchOccupations()
  }, [])
  useEffect(() => {
    if (!isLoadingReset) {
      setTimeout(() => {
        resetFetchPassword()
      }, 1000)
    }
  }, [isLoadingReset])
  useEffect(() => {
    if (params.userEdit) {
      setUserForm({ ...params.userEdit })
    }
  }, [params.userEdit])
  useEffect(() => {
    if (createUpdateResponse?.id) {
      params.fetchUsers()
      params.handleCloseForm()
      setUserForm({})
    }
  }, [createUpdateResponse])
  const validateForm = () => {
    if (!userForm?.id && password.length < 5) return false
    if (!userForm?.name) return false
    if (!userForm?.surname) return false
    if (!userForm?.email) return false
    if (!userForm?.occupation || !userForm.occupation.id) return false
    return true
  }
  const handleCreateOrUpdate = () => {
    if (validateForm()) {
      resetCreateUpdate()
      fetchCreateUpdate({
        email: userForm?.email ?? "",
        password: password,
        user: userForm as UserInfo
      })
    }
  }
  const handleChangeValueString = (key: keyof UserInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || ""
    setUserForm({
      ...userForm,
      [key]: value.trim()
    })
  }
  const handleChangeOccupation = (occupation: Occupation) => () => {
    setUserForm({
      ...userForm,
      occupation
    })
  }
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const resetPassword = () => {
    if (userForm?.email) {
      fetchReset({
        email: userForm.email
      })
    }
  }
  return (
    <Grid container component={Paper} flexDirection="column" padding={1} gap={1}>
      {(isLoadingCreateUpdate || isLoadingReset) && <LinearProgress />}
      <Typography variant="h6" textAlign="center">
        {userForm?.id ? "Actualizar usuario" : "Crear usuario"}
      </Typography>
      <Grid container gap={1}>
        <Grid item flex={1}>
          <TextField
            onChange={handleChangeValueString("name")}
            value={userForm?.name || " "}
            label="Nombres"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item flex={1}>
          <TextField
            onChange={handleChangeValueString("surname")}
            value={userForm?.surname || " "}
            label="Apellidos"
            size="small"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container gap={1}>
        <Grid item flex={1}>
          <TextField
            onChange={handleChangeValueString("dni")}
            value={userForm?.dni || " "}
            label="DNI"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item flex={1}>
          <TextField
            onChange={handleChangeValueString("phone")}
            value={userForm?.phone || " "}
            label="Teléfono"
            size="small"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container gap={1}>
        <Grid item flex={1}>
          <TextField
            onChange={handleChangeValueString("email")}
            value={userForm?.email || " "}
            label="Correo"
            disabled={!!userForm?.id}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid container flexDirection="row" item flex={1}>
          <TextField
            value={userForm?.id ? "-----" : password}
            onChange={handleChangePassword}
            label="Contraseña"
            size="small"
            type="password"
            InputProps={{
              endAdornment: userForm?.id && (
                <Tooltip title="Enviar link de cambio de contraseña">
                  <IconButton size="small" onClick={resetPassword}>
                    <Email fontSize="small" />
                  </IconButton>
                </Tooltip>
              )
            }}
            disabled={!!userForm?.id}
          />
        </Grid>
      </Grid>
      <Grid container gap={1}>
        <TextField
          onChange={handleChangeValueString("address")}
          value={userForm?.address || " "}
          label="Dirección"
          size="small"
          fullWidth
        />
      </Grid>
      <Grid container>
        <Grid item flex={1}>
          <FormControl size="small" fullWidth>
            <InputLabel id="occupation">Ocupación</InputLabel>
            <Select
              value={userForm?.occupation?.id || ""}
              disabled={isLoadingOccupation}
              size="small"
              labelId="occupation"
              label="Ocupación"
            >
              <MenuItem value={""}>Seleccionar una ocupación</MenuItem>
              {occupations?.map((p) => (
                <MenuItem key={p.id} value={p.id} onClick={handleChangeOccupation(p)}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        onClick={handleCreateOrUpdate}
        size="small"
        disabled={isLoadingCreateUpdate || !validateForm()}
        variant="contained"
        color="primary"
      >
        Guardar
      </Button>
      {(errorCreateUpdate || errorReset) && (
        <Alert variant="outlined" color="error" onClose={resetCreateUpdate}>
          <Typography>
            Hubo un error, code:
            {errorCreateUpdate?.replace("Firebase:", "")}
            {errorReset?.replace("Firebase:", "")}
          </Typography>
        </Alert>
      )}
      {responseResetPassword && (
        <Alert variant="outlined" color="info" onClose={resetFetchPassword}>
          <Typography>Enviando correctmante</Typography>
        </Alert>
      )}
    </Grid>
  )
}
export default UserForm
