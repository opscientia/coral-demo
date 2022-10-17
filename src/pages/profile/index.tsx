import React, { ReactElement, useEffect, useState } from 'react'
import Page from '@shared/Page'
import ProfilePage from '../../components/Profile'
import { accountTruncate } from '@utils/web3'
import { useWeb3 } from '@context/Web3'
import { useRouter } from 'next/router'
import web3 from 'web3'
import { getCookie, deleteCookie } from 'cookies-next'
import User from '../../models/User'
import connect from '../../lib/database'
import jwt from 'jsonwebtoken'

export default function PageProfile({ orcid }): ReactElement {
  const router = useRouter()
  const { accountId } = useWeb3()
  const [finalAccountId, setFinalAccountId] = useState<string>()
  const [finalAccountEns, setFinalAccountEns] = useState<string>()

  // Have accountId in path take over, if not present fall back to web3
  useEffect(() => {
    async function init() {
      if (!router?.asPath) return

      // Path is root /profile, have web3 take over
      if (router.asPath === '/profile') {
        setFinalAccountId(accountId)
        return
      }

      const pathAccount = router.query.account as string

      // Path has ETH addreess
      if (web3.utils.isAddress(pathAccount)) {
        const finalAccountId = pathAccount || accountId
        setFinalAccountId(finalAccountId)
      }
    }
    init()
  }, [router, accountId])

  // Replace pathname with ENS name if present
  useEffect(() => {
    if (!finalAccountEns || router.asPath === '/profile') return

    const newProfilePath = `/profile/${finalAccountEns}`
    // make sure we only replace path once
    if (newProfilePath !== router.asPath) router.replace(newProfilePath)
  }, [router, finalAccountEns, accountId])

  return (
    <Page
      uri={router.route}
      title={accountTruncate(finalAccountId)}
      noPageHeader
    >
      <ProfilePage accountId={finalAccountId} orcid={orcid} />
    </Page>
  )
}

export async function getServerSideProps({ req, res }) {
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
    console.log('verfied' + verified)
    const obj = await User.findOne({ _id: verified.id })
    console.log('obj' + obj)
    if (!obj)
      return {
        props: {
          orcid: ''
        }
      }
    return {
      props: {
        orcid: obj.orcid
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
