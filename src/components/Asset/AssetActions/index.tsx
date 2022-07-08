import React, { ReactElement, useState, useEffect } from 'react'
import Consume from './Download'
import { FileInfo, LoggerInstance, Datatoken } from '@oceanprotocol/lib'
import Tabs, { TabsItem } from '@shared/atoms/Tabs'
import { compareAsBN } from '@utils/numbers'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import Web3Feedback from '@shared/Web3Feedback'
import { getFileDidInfo, getFileUrlInfo } from '@utils/provider'
import { getOceanConfig } from '@utils/ocean'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import styles from './index.module.css'
import { useFormikContext } from 'formik'
// import { FormPublishData } from 'src/components/Publish/_types'
import { AssetExtended } from 'src/@types/AssetExtended'
import PoolProvider from '@context/Pool'

export default function AssetActions({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const newCancelToken = useCancelToken()
  const isMounted = useIsMounted()

  // TODO: using this for the publish preview works fine, but produces a console warning
  // on asset details page as there is no formik context there:
  // Warning: Formik context is undefined, please verify you are calling useFormikContext()
  // as child of a <Formik> component.
  // const formikState = useFormikContext<FormPublishData>()

  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()
  const [dtBalance, setDtBalance] = useState<string>()

  // Get and set user DT balance
  useEffect(() => {
    if (!web3 || !accountId || !isAssetNetwork) return

    async function init() {
      try {
        const datatokenInstance = new Datatoken(web3)
        const dtBalance = await datatokenInstance.balance(
          asset.services[0].datatokenAddress,
          accountId
        )
        setDtBalance(dtBalance)
      } catch (e) {
        LoggerInstance.error(e.message)
      }
    }
    init()
  }, [web3, accountId, asset, isAssetNetwork])

  // Check user balance against price
  useEffect(() => {
    if (asset?.accessDetails?.type === 'free') setIsBalanceSufficient(true)
    if (
      !asset?.accessDetails?.price ||
      !accountId ||
      !balance?.ocean ||
      !dtBalance
    )
      return

    setIsBalanceSufficient(
      compareAsBN(balance.ocean, `${asset?.accessDetails.price}`) ||
        Number(dtBalance) >= 1
    )

    return () => {
      setIsBalanceSufficient(false)
    }
  }, [balance, accountId, asset?.accessDetails, dtBalance])

  const UseContent = (
    <Consume
      asset={asset}
      dtBalance={dtBalance}
      isBalanceSufficient={isBalanceSufficient}
      fileIsLoading={false}
    />
  )

  const tabs: TabsItem[] = [{ title: 'Use', content: UseContent }]

  return (
    <>
      <PoolProvider>
        <Tabs items={tabs} className={styles.actions} />
        <Web3Feedback
          networkId={asset?.chainId}
          isAssetNetwork={isAssetNetwork}
        />
      </PoolProvider>
    </>
  )
}
