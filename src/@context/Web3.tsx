import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  ReactNode,
  useCallback
} from 'react'
import Web3 from 'web3'
import Web3Modal, { getProviderInfo, IProviderInfo } from 'web3modal'
import { infuraProjectId as infuraId } from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { LoggerInstance } from '@oceanprotocol/lib'
import { isBrowser } from '@utils/index'
import { getEnsName } from '@utils/ens'
import { getOceanBalance } from '@utils/ocean'
import { useMarketMetadata } from './MarketMetadata'
import { Web3Auth } from '@web3auth/web3auth'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base'
import RPC from 'src/@utils/evm'

interface Web3ProviderValue {
  web3auth: Web3Auth | null
  setWeb3auth: React.Dispatch<React.SetStateAction<Web3Auth>>
  provider: SafeEventEmitterProvider | null
  setProvider: React.Dispatch<React.SetStateAction<SafeEventEmitterProvider>>
  web3: Web3
  web3Provider: any
  web3Modal: Web3Modal
  web3ProviderInfo: IProviderInfo
  accountId: string
  isTestnet: boolean
  web3Loading: boolean
  connect: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  logout: () => Promise<void>
}

const web3ModalTheme = {
  background: 'var(--background-body)',
  main: 'var(--font-color-heading)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--border-color)',
  hover: 'var(--background-highlight)'
}

// HEADS UP! We inline-require some packages so the SSR build does not break.
// We only need them client-side.
const providerOptions = isBrowser
  ? {
      walletconnect: {
        package: WalletConnectProvider,
        options: { infuraId }
      }
      // torus: {
      //   package: require('@toruslabs/torus-embed')
      //   // options: {
      //   //   networkParams: {
      //   //     host: oceanConfig.url, // optional
      //   //     chainId: 1337, // optional
      //   //     networkId: 1337 // optional
      //   //   }
      //   // }
      // }
    }
  : {}

export const web3ModalOpts = {
  cacheProvider: true,
  providerOptions,
  theme: web3ModalTheme
}

const refreshInterval = 20000 // 20 sec.

const Web3Context = createContext({} as Web3ProviderValue)

function Web3Provider({ children }: { children: ReactNode }): ReactElement {
  const { appConfig } = useMarketMetadata()

  const [web3, setWeb3] = useState<Web3>()
  const [web3Provider, setWeb3Provider] = useState<any>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [web3ProviderInfo, setWeb3ProviderInfo] = useState<IProviderInfo>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [accountId, setAccountId] = useState<string>()
  const [web3Loading, setWeb3Loading] = useState<boolean>(true)

  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  )

  // -----------------------------------
  // Helper: connect to web3
  // -----------------------------------
  const connect = useCallback(async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet')
      setWeb3Loading(false)
      return
    }
    try {
      setWeb3Loading(true)
      console.log('[web3] Connecting Web3...')

      const web3authProvider = await web3auth.connect()
      setProvider(web3authProvider)

      // const web3 = new Web3(provider)
      // setWeb3(web3)
      // console.log('[web3] Web3 created.', web3)
      const web3 = new Web3(web3authProvider)
      setWeb3(web3)
      console.log('[web3] Web3 created.', web3)

      const rpc = new RPC(web3authProvider)
      const accounts = await rpc.getAccounts()
      const accountId = accounts[0]
      setAccountId(accountId)
      console.log('[web3] account id', accountId)
    } catch (error) {
      console.error('[web3] Error: ', error.message)
    } finally {
      setWeb3Loading(false)
    }
  }, [web3auth])

  const logout = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet')
      return
    }
    await web3auth.logout()
    setAccountId(undefined)
    setProvider(null)
  }

  // const getAccounts = async () => {
  //   if (!provider) {
  //     console.log('provider not initialized yet')
  //     return
  //   }
  //   const rpc = new RPC(provider)
  //   const userAccount = await rpc.getAccounts()
  //   console.log(userAccount)
  // }

  const signMessage = async (message: string) => {
    if (!provider) {
      console.log('provider not initialized yet')
      return
    }
    const rpc = new RPC(provider)
    const result = await rpc.signMessage(message)
    return result
  }

  // -----------------------------------
  // Create initial Web3Modal instance
  // -----------------------------------
  // useEffect(() => {
  //   if (web3Modal) {
  //     setWeb3Loading(false)
  //     return
  //   }

  //   async function init() {
  //     // note: needs artificial await here so the log message is reached and output
  //     const web3ModalInstance = await new Web3Modal(web3ModalOpts)
  //     setWeb3Modal(web3ModalInstance)
  //     LoggerInstance.log(
  //       '[web3] Web3Modal instance created.',
  //       web3ModalInstance
  //     )
  //   }
  //   init()
  // }, [connect, web3Modal])

  // -----------------------------------
  // Reconnect automatically for returning users
  // -----------------------------------
  // useEffect(() => {
  //   if (!web3Modal?.cachedProvider) return

  //   async function connectCached() {
  //     LoggerInstance.log(
  //       '[web3] Connecting to cached provider: ',
  //       web3Modal.cachedProvider
  //     )
  //     await connect()
  //   }
  //   connectCached()
  // }, [connect, web3Modal])

  // -----------------------------------
  // Get and set web3 provider info
  // -----------------------------------
  // Workaround cause getInjectedProviderName() always returns `MetaMask`
  // https://github.com/oceanprotocol/market/issues/332
  useEffect(() => {
    if (!web3Provider) return

    const providerInfo = getProviderInfo(web3Provider)
    setWeb3ProviderInfo(providerInfo)
  }, [web3Provider])

  // -----------------------------------
  // Handle change events
  // -----------------------------------
  async function handleAccountsChanged(accounts: string[]) {
    LoggerInstance.log('[web3] Account changed', accounts[0])
    setAccountId(accounts[0])
  }

  useEffect(() => {
    if (!web3Provider || !web3) return

    web3Provider.on('accountsChanged', handleAccountsChanged)

    return () => {
      web3Provider.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [web3Provider, web3])

  return (
    <Web3Context.Provider
      value={{
        web3auth,
        setWeb3auth,
        provider,
        setProvider,
        web3,
        web3Provider,
        web3Modal,
        web3ProviderInfo,
        accountId,
        isTestnet,
        web3Loading,
        signMessage,
        connect,
        logout
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

// Helper hook to access the provider values
const useWeb3 = (): Web3ProviderValue => useContext(Web3Context)

export { Web3Provider, useWeb3, Web3Context }
export default Web3Provider
