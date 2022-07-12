interface StorageIds {
  cid: string
  estuaryId: number
}

export interface Chunk {
  _id?: string
  datasetId?: string // id of parent dataset
  path?: string
  doi?: string
  storageIds?: StorageIds
  fileIds?: string[]
  size?: number
}
