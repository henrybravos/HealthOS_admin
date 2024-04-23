import { UserCategoryEnum, UserRoleEnum } from "@core/types"
import { useUserForm } from "@features/users/hooks/useUserForm"
import { validateUserForm } from "@features/users/user.helpers"
import { UserFormComponentParams } from "@features/users/user.types"
import { RolesSpanish } from "@features/users/users-list.const"
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

const UserFormComponent = (params: UserFormComponentParams) => {
  const {
    errors,
    handleChangeOccupation,
    handleResetFetchPassword,
    handleResetCreateUpdate,
    handleChangeCategory,
    handleResetPassword,
    handleChangeRole,
    handleChangeValueString,
    handleCreateOrUpdate,
    isLoadingCreateUpdate,
    isLoadingReset,
    isLoadingOccupation,
    occupations,
    userForm,
    responseResetPassword,
    errorCreateUpdate,
    errorResetPassword
  } = useUserForm(params)

  return (
    <Grid container component={Paper} elevation={2} flexDirection="column" padding={1} gap={1}>
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
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item flex={1}>
          <TextField
            onChange={handleChangeValueString("surname")}
            value={userForm?.surname || " "}
            label="Apellidos"
            size="small"
            fullWidth
            error={!!errors.surname}
            helperText={errors.surname}
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
            error={!!errors.dni}
            helperText={errors.dni}
          />
        </Grid>
        <Grid item flex={1}>
          <TextField
            onChange={handleChangeValueString("phone")}
            value={userForm?.phone || " "}
            label="Teléfono"
            size="small"
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
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
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid container flexDirection="row" item flex={1}>
          <TextField
            value={userForm?.id ? "-----" : userForm.password || ""}
            onChange={handleChangeValueString("password")}
            label="Contraseña"
            size="small"
            type="password"
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            InputProps={{
              endAdornment: userForm?.id && (
                <Tooltip title="Enviar link de cambio de contraseña">
                  <IconButton size="small" onClick={handleResetPassword}>
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
        <Grid item flex={3}>
          <TextField
            onChange={handleChangeValueString("address")}
            value={userForm?.address || " "}
            label="Dirección"
            size="small"
            fullWidth
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item flex={1}>
          <FormControl error={!!errors.category} size="small" fullWidth>
            <InputLabel id="category">Categoría</InputLabel>
            <Select
              value={userForm?.category || ""}
              size="small"
              labelId="category"
              label="Categoría"
            >
              {Object.values(UserCategoryEnum).map((cat) => (
                <MenuItem key={cat} value={cat} onClick={handleChangeCategory(cat)}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item flex={1}>
          <FormControl size="small" fullWidth error={!!errors.occupation}>
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
        <Grid item flex={1}>
          <FormControl error={!!errors.roles} size="small" fullWidth>
            <InputLabel id="rol">Rol</InputLabel>
            <Select value={userForm?.roles?.[0] || ""} size="small" labelId="rol" label="Rol">
              {Object.values(UserRoleEnum).map((role) => (
                <MenuItem key={role} value={role} onClick={handleChangeRole(role)}>
                  {RolesSpanish[role]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        onClick={handleCreateOrUpdate}
        size="small"
        disabled={isLoadingCreateUpdate || !validateUserForm(userForm).isValid}
        variant="contained"
        color="primary"
      >
        Guardar
      </Button>
      {errorCreateUpdate && (
        <Alert variant="outlined" color="error" onClose={handleResetCreateUpdate}>
          <Typography>
            Hubo un error, code:
            {errorCreateUpdate?.replace("Firebase:", "")}
            {errorResetPassword?.replace("Firebase:", "")}
          </Typography>
        </Alert>
      )}
      {(errorCreateUpdate || errorResetPassword) && (
        <Alert variant="outlined" color="error" onClose={handleCreateOrUpdate}>
          <Typography>
            Hubo un error, code:
            {errorCreateUpdate?.replace("Firebase:", "")}
            {errorResetPassword?.replace("Firebase:", "")}
          </Typography>
        </Alert>
      )}
      {responseResetPassword && (
        <Alert variant="outlined" color="info" onClose={handleResetFetchPassword}>
          <Typography>Enviando correctmante</Typography>
        </Alert>
      )}
    </Grid>
  )
}
export default UserFormComponent
