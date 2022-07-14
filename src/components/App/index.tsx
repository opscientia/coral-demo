import React, { ReactElement, useState, useEffect } from 'react'
import Alert from '@shared/atoms/Alert'
import Footer from '../Footer/Footer'
import Header from '../Header'
import { useWeb3 } from '@context/Web3'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import AnnouncementBanner from '@shared/AnnouncementBanner'
import PrivacyPreferenceCenter from '../Privacy/PrivacyPreferenceCenter'
import styles from './index.module.css'
import { ToastContainer } from 'react-toastify'
import contentPurgatory from '../../../content/purgatory.json'
import { useMarketMetadata } from '@context/MarketMetadata'
import { Web3Auth } from '@web3auth/web3auth'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base'

const clientId = 'YOUR_CLIENT_ID'

export default function App({
  children
}: {
  children: ReactElement
}): ReactElement {
  const { siteContent, appConfig } = useMarketMetadata()
  const { accountId, web3auth, setWeb3auth, provider, setProvider } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  function openInNewTab() {
    window
      .open(
        'https://blog.oceanprotocol.com/how-to-publish-a-data-nft-f58ad2a622a9',
        '_blank'
      )
      .focus()
  }

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x1',
            rpcTarget: 'https://rpc.ankr.com/eth' // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
          }
        })

        setWeb3auth(web3auth)

        await web3auth.initModal()
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [])

  return (
    <div className={styles.app}>
      {siteContent?.announcement?.main !== '' && (
        <AnnouncementBanner
          text={siteContent?.announcement?.main}
          action={{
            name: 'Explore OceanONDA V4.',
            style: 'link',
            handleAction: openInNewTab
          }}
        />
      )}
      <Header />

      {isInPurgatory && (
        <Alert
          title={contentPurgatory.account.title}
          badge={`Reason: ${purgatoryData?.reason}`}
          text={contentPurgatory.account.description}
          state="error"
        />
      )}
      <main className={styles.main}>{children}</main>
      <Footer />

      {appConfig?.privacyPreferenceCenter === 'true' && (
        <PrivacyPreferenceCenter style="small" />
      )}

      <ToastContainer position="bottom-right" newestOnTop />
    </div>
  )
}
