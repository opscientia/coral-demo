import {
  DDO,
  generateDid,
  getHash,
  Metadata,
  Service
} from '@oceanprotocol/lib'
import { mapTimeoutStringToSeconds } from '@utils/ddo'
import { getEncryptedFiles } from '@utils/provider'
import slugify from 'slugify'
import { FormPublishData } from './_types'
import { sanitizeUrl } from '@utils/url'

export function getFieldContent(
  fieldName: string,
  fields: FormFieldContent[]
): FormFieldContent {
  return fields.filter((field: FormFieldContent) => field.name === fieldName)[0]
}

function dateToStringNoMS(date: Date): string {
  return date.toISOString().replace(/\.[0-9]{3}Z/, 'Z')
}

function transformTags(value: string): string[] {
  const originalTags = value?.split(',')
  const transformedTags = originalTags?.map((tag) => slugify(tag).toLowerCase())
  return transformedTags
}

export async function transformPublishFormToDdo(
  values: FormPublishData,
  // Those 2 are only passed during actual publishing process
  // so we can always assume if they are not passed, we are on preview.
  datatokenAddress?: string,
  nftAddress?: string
): Promise<DDO> {
  const { metadata, services, user } = values
  const { chainId, accountId } = user
  const { name, description, tags, author, termsAndConditions } = metadata
  const { files, links } = services[0]

  const did = nftAddress ? generateDid(nftAddress, chainId) : '0x...'
  const currentTime = dateToStringNoMS(new Date())
  const isPreview = !datatokenAddress && !nftAddress

  // Transform from files[0].url to string[] assuming only 1 file
  const filesTransformed = files?.length &&
    files[0].valid && [sanitizeUrl(files[0].url)]
  const linksTransformed = links?.length &&
    links[0].valid && [sanitizeUrl(links[0].url)]

  const newMetadata: Metadata = {
    created: currentTime,
    updated: currentTime,
    name,
    description,
    tags: transformTags(tags),
    author,
    license: 'https://market.oceanprotocol.com/terms',
    links: linksTransformed,
    additionalInformation: {
      termsAndConditions
    }
  }

  // this is the default format hardcoded
  const file = {
    files: [
      {
        type: 'url',
        index: 0,
        url: files[0].url,
        method: 'GET'
      }
    ]
  }
  const filesEncrypted =
    !isPreview &&
    files?.length &&
    files[0].valid &&
    (await getEncryptedFiles(file, providerUrl.url))

  const newService: Service = {
    id: getHash(datatokenAddress + filesEncrypted),
    files: filesEncrypted || '',
    datatokenAddress
  }

  const newDdo: DDO = {
    '@context': ['https://w3id.org/did/v1'],
    id: did,
    nftAddress,
    version: '4.1.0',
    chainId,
    metadata: newMetadata,
    services: [newService]
  }

  return newDdo
}
