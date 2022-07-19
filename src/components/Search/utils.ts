import { LoggerInstance } from '@oceanprotocol/lib'
import queryString from 'query-string'
import { CancelToken } from 'axios'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../@types/aquarius/SearchQuery'
import { Dataset, PagedDatasets } from 'src/@types/Dataset'

const totalAllowedOnPage = 21 // max of 21 results per page

function getDatasetsOnPage(datasets: Dataset[], page: string | void) {
  const pageIndex = page ? parseInt(page) - 1 : 0
  return datasets.slice(
    pageIndex * totalAllowedOnPage,
    pageIndex * totalAllowedOnPage + totalAllowedOnPage
  )
}

export function updateQueryStringParameter(
  uri: string,
  key: string,
  newValue: string
): string {
  const regex = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'

  if (uri.match(regex)) {
    return uri.replace(regex, '$1' + key + '=' + newValue + '$2')
  } else {
    return uri + separator + key + '=' + newValue
  }
}

export function escapeESReservedChars(text: string): string {
  return text?.replace(/([!*+\-=<>&|()\\[\]{}^~?:\\/"])/g, '\\$1')
}

export async function getResults(
  params: {
    text?: string
    owner?: string
    tags?: string
    categories?: string
    page?: string
    offset?: string
    sort?: string
    sortOrder?: string
    serviceType?: string
    accessType?: string
  },
  cancelToken?: CancelToken
): Promise<PagedDatasets> {
  try {
    let datasets
    if (params.text) {
      console.log(`params.text: ${params.text}`)
      const resp = await fetch(
        process.env.NEXT_PUBLIC_PROXY_API_URL +
          `/metadata/datasets/published/search?searchStr=${params.text}`,
        {
          method: 'GET'
        }
      )
      datasets = await resp.json()
    } else {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_PROXY_API_URL + `/metadata/datasets/published`,
        {
          method: 'GET'
        }
      )
      datasets = await resp.json()
    }
    const datasetsOnPage = getDatasetsOnPage(datasets, params.page)
    const totalPages = Math.max(
      Math.round(datasets.length / totalAllowedOnPage),
      1
    )
    const pagedDatasets = {
      results: datasetsOnPage,
      page: 1,
      totalPages,
      totalResults: datasets.length
    }
    return pagedDatasets
  } catch (err) {
    return {
      results: [],
      page: 0,
      totalPages: 0,
      totalResults: 0
    }
  }
  // const queryResult = await queryMetadata(searchQuery, cancelToken)
  // return queryResult
}

export async function addExistingParamsToUrl(
  location: Location,
  excludedParams: string[]
): Promise<string> {
  const parsed = queryString.parse(location.search)
  let urlLocation = '/search?'
  if (Object.keys(parsed).length > 0) {
    for (const querryParam in parsed) {
      if (!excludedParams.includes(querryParam)) {
        if (querryParam === 'page' && excludedParams.includes('text')) {
          LoggerInstance.log('remove page when starting a new search')
        } else {
          const value = parsed[querryParam]
          urlLocation = `${urlLocation}${querryParam}=${value}&`
        }
      }
    }
  } else {
    // sort should be relevance when fixed in aqua
    urlLocation = `${urlLocation}sort=${encodeURIComponent(
      SortTermOptions.Relevance
    )}&sortOrder=${SortDirectionOptions.Descending}&`
  }
  urlLocation = urlLocation.slice(0, -1)
  return urlLocation
}
