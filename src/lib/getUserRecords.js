import { xml2json } from 'xml-js'
export default async function getUserRecords(accessToken, orcid) {
  let userRecords = undefined
  try {
    const URL = `https://api.sandbox.orcid.org/v3.0/${orcid}/record`
    const bearerToken = 'Bearer' + accessToken
    fetch(URL, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        Authorization: bearerToken,
        'Content-Type': 'application/xml'
      }
    }).then((str) => {
      userRecords = JSON.parse(xml2json(str))
      console.log(userRecords)
    })
  } catch (error) {
    console.error(error)
  }

  return userRecords
}
