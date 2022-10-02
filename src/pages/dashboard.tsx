import { getCookie, removeCookies } from 'cookies-next'
import Head from 'next/head'
import React from 'react'
import dbConnect from '@utils/auth/database'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { useRouter } from 'next/router'

function Dashboard({ username: { username: any }, orcid: { orcid: any } }) {
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
      <div>Welcome {username}!</div>
      <div>ORCID: {orcid}</div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    // connect db
    await dbConnect()
    // check cookie
    const token = getCookie('token', { req, res })
    if (!token)
      return {
        redirect: {
          destination: '/orcid'
        }
      }

    const verified = await jwt.verify(token, process.env.COOKIE_SECRET)
    const obj = await User.findOne({ _id: verified.id })
    if (!obj)
      return {
        redirect: {
          destination: '/orcid'
        }
      }
    return {
      props: {
        email: obj.email,
        name: obj.name
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
