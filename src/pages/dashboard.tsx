import { getCookie, removeCookies } from 'cookies-next'
import Head from 'next/head'
import React from 'react'
import dbConnect from '@utils/auth/database'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { useRouter } from 'next/router'

function Dashboard(params) {
  const router = useRouter()

  const logout = () => {
    removeCookies('token')
    router.replace('/orcid')
  }

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div>Welcome {params.username}!</div>
      <div>ORCID: {params.orcid}</div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    // connect db
    await dbConnect()
    // check cookie
    const token = getCookie('token', { req, res }).toString()
    if (!token)
      return {
        redirect: {
          destination: '/orcid'
        }
      }

    const verified: any = await jwt.verify(token, process.env.COOKIE_SECRET)
    const obj = await User.findOne({ _id: verified.id })
    if (!obj)
      return {
        redirect: {
          destination: '/orcid'
        }
      }
    return {
      props: {
        username: obj.username,
        orcid: obj.orcid
      }
    }
  } catch (err) {
    removeCookies('token', { req, res })
    return {
      redirect: {
        destination: '/orcid'
      }
    }
  }
}

export default Dashboard
