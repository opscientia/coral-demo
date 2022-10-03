import { getCookie } from 'cookies-next'

import Link from 'next/link'
import React, { ReactElement } from 'react'
import Page from '@shared/Page'
import { useRouter } from 'next/router'

export default function Home(): ReactElement {
  const router = useRouter()

  return (
    <Page uri={router.route}>
      <Link href="/api/orcid"> Login with ORCID</Link>
    </Page>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    const cookieExists = getCookie('token', { req, res })
    console.log('cookie Exists:' + cookieExists)
    if (cookieExists) return { redirect: { destination: '/dashboard' } }
    return { props: {} }
  } catch (err) {
    return { props: {} }
  }
}
