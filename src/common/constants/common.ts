import { GridLocaleText } from "@mui/x-data-grid"
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity"

import packageJson from "../../../package.json"

export const LS_TOKEN = "token"
export const LS_USER = "user"
export const VERSION_APP = packageJson.version

export const localizedTextsMap: Partial<GridLocaleText> = {
  toolbarFilters: "Filtros",
  toolbarColumns: "Visibilidad de columnas",
  toolbarDensity: "Densidad de las filas",
  toolbarExport: "Exportar",

  filterOperatorContains: "Contiene",
  filterOperatorEquals: "Igual",
  filterOperatorStartsWith: "Inicia con",
  filterOperatorEndsWith: "Finaliza con",
  filterOperatorIsEmpty: "Vacío",
  filterOperatorIsNotEmpty: "No es vacío",
  filterOperatorIsAnyOf: "es cualquiera de",
  filterPanelColumns: "Columna",
  filterPanelOperator: "Operador",
  filterPanelInputLabel: "Valor a filtrar",
  filterPanelInputPlaceholder: "Ingrese valor",

  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estandar",
  toolbarDensityComfortable: "Confortable",

  toolbarExportCSV: "Exportar a CSV",
  toolbarExportPrint: "Imprimir"
}
export const INITIAL_STATE_DATAGRID: GridInitialStateCommunity = {
  pagination: {
    paginationModel: {
      pageSize: 12
    }
  }
}
export const PAGE_SIZE_OPTIONS = [12, 25, 50, 100]
