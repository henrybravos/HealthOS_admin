import { ChangeEvent, useEffect, useMemo, useState } from "react"

import { useFetchApi } from "@common/hooks"
import { AuthService, OccupationService } from "@core/services"
import { Occupation, UserCategoryEnum, UserInfo, UserRoleEnum } from "@core/types"
import { validateUserForm } from "@features/users/user.helpers"
import { UserForm, UserFormComponentParams } from "@features/users/user.types"
import { initUserForm } from "@features/users/users-list.const"

const useUserForm = (params: UserFormComponentParams) => {
  const [userForm, setUserForm] = useState<UserForm>(initUserForm)
  const [isLoadingOccupation, occupations, fetchOccupations] = useFetchApi(
    OccupationService.getAllOccupations
  )
  const [
    isLoadingReset,
    responseResetPassword,
    fetchResetPassword,
    errorResetPassword,
    handleResetFetchPassword
  ] = useFetchApi(AuthService.sendPasswordResetEmail)
  const [
    isLoadingCreateUpdate,
    createUpdateResponse,
    fetchCreateUpdate,
    errorCreateUpdate,
    handleResetCreateUpdate
  ] = useFetchApi(AuthService.createOrUpdateUser)
  useEffect(() => {
    fetchOccupations()
  }, [])
  useEffect(() => {
    if (!isLoadingReset) {
      setTimeout(() => {
        handleResetFetchPassword()
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
      setUserForm(initUserForm)
    }
  }, [createUpdateResponse])

  const handleCreateOrUpdate = () => {
    const errors = validateUserForm(userForm)
    if (errors.isValid) {
      handleResetCreateUpdate()
      fetchCreateUpdate({
        email: userForm?.email ?? "",
        password: userForm.password ?? "",
        user: { ...userForm, racsGoals: Number(userForm.racsGoals) || 0 } as UserInfo
      })
    }
  }
  const handleChangeValueString = (key: keyof UserForm) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || ""
    setUserForm({
      ...userForm,
      [key]: value.trim()
    })
  }
  const handleChangeRole = (role: UserRoleEnum) => () => {
    setUserForm({
      ...userForm,
      roles: [role]
    })
  }
  const handleChangeCategory = (category: UserCategoryEnum) => () => {
    setUserForm({
      ...userForm,
      category
    })
  }
  const handleChangeOccupation = (occupation: Occupation) => () => {
    setUserForm({
      ...userForm,
      occupation
    })
  }
  const handleResetPassword = () => {
    if (userForm?.email) {
      fetchResetPassword({
        email: userForm.email
      })
    }
  }
  const errorsForm = useMemo(() => {
    const errors = validateUserForm(userForm)
    return errors
  }, [userForm])

  return {
    handleChangeOccupation,
    handleChangeRole,
    handleChangeValueString,
    handleResetPassword,
    handleCreateOrUpdate,
    handleResetFetchPassword,
    handleResetCreateUpdate,
    handleChangeCategory,

    isFormError: errorsForm.errors,
    isLoadingReset,
    isLoadingCreateUpdate,
    isLoadingOccupation,
    occupations,
    errorCreateUpdate,
    errorResetPassword,
    errors: errorsForm.errors,
    userForm,
    responseResetPassword
  }
}
export { useUserForm }
