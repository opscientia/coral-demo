export interface Dataset {
  _id?: string
  title?: string
  description?: string
  authors?: string[]
  uploader?: string // blockchain address
  license?: string
  doi?: string
  keywords?: string[]
  published?: boolean
  size?: number
  standard?: {
    bids?: {
      validated?: boolean
      version?: string
      deidentified?: boolean
      modality?: string[]
      tasks?: string[]
      warnings?: string
      errors?: string
    }
  }
  miscellaneous?: any
  chunkIds?: number[]
}
