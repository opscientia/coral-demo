export interface LockerForm {
  // ---- required fields ----
  file: File
  // ---- optional fields ----
  // tags?: string
}

export interface LockerFormFieldProps {
  label: string
  name: string
  type?: string
  options?: string[]
  required?: boolean
  multiple?: boolean
  disabled?: boolean
  help?: string
  pattern?: string
  min?: string
  disclaimer?: string
  disclaimerValues?: string[]
}

export interface LockerFormContent {
  title: string
  description?: string
  success: string
  data: LockerFormFieldProps[]
}
