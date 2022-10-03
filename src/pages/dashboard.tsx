import { getCookie, deleteCookie } from 'cookies-next'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import connect from '../lib/database'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { useRouter } from 'next/router'
import Page from '@shared/Page'

function Dashboard({ username, orcid }): ReactElement {
  const router = useRouter()

  const logout = () => {
    deleteCookie('token')
    router.replace('/login')
  }

  return (
    <Page uri={router.route}>
      <div>
        <Head>
          <title>Dashboard</title>
        </Head>
        <div>Welcome {username}!</div>
        <div>{orcid}</div>
        <button onClick={logout}>Logout</button>
      </div>
    </Page>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    // connect db
    console.log("i'm in dashboard")
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
    console.log('verfied' + verified)
    const obj = await User.findOne({ _id: verified.id })
    console.log('obj' + obj)
    if (!obj)
      return {
        redirect: {
          destination: '/login'
        }
      }
    return {
      props: {
        orcid: obj.orcid,
        username: obj.username
      }
    }
  } catch (err) {
    console.log('err in dashboard' + err)
    deleteCookie('token', { req, res })
    return {
      redirect: {
        destination: '/login'
      }
    }
  }
}

export default Dashboard
