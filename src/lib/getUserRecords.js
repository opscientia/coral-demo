export default async function getUserRecords(accessToken, orcid) {
  const URL = `https://api.sandbox.orcid.org/v3.0/${orcid}/record`
  const bearerToken = 'Bearer' + accessToken
  const fetchUserRecords = await fetch(URL, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {
      Authorization: bearerToken,
      'Content-Type': 'application/json'
    }
  })
  const userRecords = await fetchUserRecords.json()

  return userRecords
}
