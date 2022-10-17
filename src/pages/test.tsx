import { getCookie } from 'cookies-next'
import Link from 'next/link'
import React, { ReactElement } from 'react'
import Page from '@shared/Page'
import { useRouter } from 'next/router'
import connect from 'src/lib/database'
import jwt from 'jsonwebtoken'
import User from 'src/models/User'
import { xml2json } from 'xml-js'
import { convertXML } from 'simple-xml-to-json'
import { parseString, Builder } from 'xml2js'

function toJson(xml: string) {
  parseString(xml, { explicitArray: false }, function (_error, result) {
    console.log(result)
  })
}

export default function Test({ orcid, records }): ReactElement {
  const router = useRouter()
  return (
    <Page uri={router.route}>
      <Link href="/test"> test page</Link>
      <p>{orcid}</p>
      <p>
        {Object.keys(records).map((key) => {
          records[key]
        })}
      </p>
    </Page>
  )
}

export async function getServerSideProps({ req, res }) {
  let userRecords

  try {
    // connect db
    await connect()
    // check cookie
    const token = getCookie('token', { req, res }).toString()
    console.log(token)
    if (!token) {
      console.error('token missing, login again')
    }

    const verified: any = await jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET
    )
    const obj = await User.findOne({ _id: verified.id })

    if (!obj)
      return {
        props: {
          orcid: 'obj undefined',
          records: 'records undefined'
        }
      }

    const URL = `https://api.sandbox.orcid.org/v3.0/${obj.orcid}/record`
    const bearerToken = 'Bearer' + obj.accessToken
    fetch(URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: bearerToken,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((str) => {
        userRecords = str
        console.log(Object.keys(userRecords))
        console.log(userRecords)
      })

    return {
      props: {
        orcid: obj.orcid,
        records: userRecords.history
      }
    }
  } catch (err) {
    console.log('err in test paage  ' + err)
    return {
      props: {}
    }
  }
}
