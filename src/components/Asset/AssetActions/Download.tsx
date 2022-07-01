import React, { ReactElement, useEffect, useState } from 'react'
import FileIcon from '@shared/FileIcon'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ButtonBuy from '@shared/ButtonBuy'
import { secondsToString } from '@utils/ddo'
import styles from './Download.module.css'
import { FileInfo, LoggerInstance, ZERO_ADDRESS } from '@oceanprotocol/lib'
import { order } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'
import { downloadFile } from '@utils/provider'
import { getOrderFeedback } from '@utils/feedback'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { OrderPriceAndFees } from 'src/@types/Price'
import { toast } from 'react-toastify'
import { useIsMounted } from '@hooks/useIsMounted'
import { usePool } from '@context/Pool'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function Download({
  asset,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading
}: {
  asset: AssetExtended
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
}): ReactElement {
  const { accountId, web3 } = useWeb3()
  const { getOpcFeeForToken } = useMarketMetadata()
  const { isInPurgatory, isAssetNetwork } = useAsset()
  const { poolData } = usePool()
  const isMounted = useIsMounted()

  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOwned, setIsOwned] = useState(false)
  const [validOrderTx, setValidOrderTx] = useState('')
  const [orderPriceAndFees, setOrderPriceAndFees] =
    useState<OrderPriceAndFees>()

  useEffect(() => {
    if (!asset?.accessDetails) return

    asset?.accessDetails?.isOwned && setIsOwned(asset?.accessDetails?.isOwned)
    asset?.accessDetails?.validOrderTx &&
      setValidOrderTx(asset?.accessDetails?.validOrderTx)

    // get full price and fees
    async function init() {
      if (
        asset?.accessDetails?.addressOrId === ZERO_ADDRESS ||
        asset?.accessDetails?.type === 'free' ||
        (!poolData && asset?.accessDetails?.type === 'dynamic') ||
        isLoading
      )
        return

      !orderPriceAndFees && setIsLoading(true)
      setStatusText('Refreshing price')
      // this is needed just for pool
      const paramsForPool: CalcInGivenOutParams = {
        tokenInLiquidity: poolData?.baseTokenLiquidity,
        tokenOutLiquidity: poolData?.datatokenLiquidity,
        tokenOutAmount: '1',
        opcFee: getOpcFeeForToken(
          asset?.accessDetails?.baseToken.address,
          asset?.chainId
        ),
        lpSwapFee: poolData?.liquidityProviderSwapFee,
        publishMarketSwapFee: asset?.accessDetails?.publisherMarketOrderFee,
        consumeMarketSwapFee: '0'
      }
      const _orderPriceAndFees = await getOrderPriceAndFees(
        asset,
        ZERO_ADDRESS,
        paramsForPool
      )

      setOrderPriceAndFees(_orderPriceAndFees)
      !orderPriceAndFees && setIsLoading(false)
    }

    init()
    /**
     * we listen to the assets' changes to get the most updated price
     * based on the asset and the poolData's information.
     * Not adding isLoading and getOpcFeeForToken because we set these here. It is a compromise
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, accountId, poolData, getOpcFeeForToken])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (!isMounted || !accountId || !asset?.accessDetails) return

    /**
     * disabled in these cases:
     * - if the asset is not purchasable
     * - if the user is on the wrong network
     * - if user balance is not sufficient
     * - if user has no datatokens
     */
    const isDisabled =
      !asset?.accessDetails.isPurchasable ||
      !isAssetNetwork ||
      ((!isBalanceSufficient || !isAssetNetwork) && !isOwned && !hasDatatoken)

    setIsDisabled(isDisabled)
  }, [
    isMounted,
    asset?.accessDetails,
    isBalanceSufficient,
    isAssetNetwork,
    hasDatatoken,
    accountId,
    isOwned
  ])

  async function handleOrderOrDownload() {
    setIsLoading(true)

    try {
      if (isOwned) {
        setStatusText(
          getOrderFeedback(
            asset.accessDetails?.baseToken?.symbol,
            asset.accessDetails?.datatoken?.symbol
          )[3]
        )

        await downloadFile(web3, asset, accountId, validOrderTx)
      } else {
        if (!hasDatatoken && asset.accessDetails.type === 'dynamic') {
          setStatusText(
            getOrderFeedback(
              asset.accessDetails.baseToken?.symbol,
              asset.accessDetails.datatoken?.symbol
            )[0]
          )
        }
        setStatusText(
          getOrderFeedback(
            asset.accessDetails.baseToken?.symbol,
            asset.accessDetails.datatoken?.symbol
          )[asset.accessDetails?.type === 'fixed' ? 2 : 1]
        )
        const orderTx = await order(web3, asset, orderPriceAndFees, accountId)
        if (!orderTx) {
          throw new Error()
        }
        setIsOwned(true)
        setValidOrderTx(orderTx.transactionHash)
      }
    } catch (error) {
      LoggerInstance.error(error)
      const message = isOwned
        ? 'Failed to download file!'
        : 'An error occurred. Check console for more information.'
      toast.error(message)
    }
    setIsLoading(false)
  }

  const PurchaseButton = () => (
    <ButtonBuy
      action="download"
      disabled={isDisabled}
      hasPreviousOrder={isOwned}
      hasDatatoken={hasDatatoken}
      dtSymbol={asset?.datatokens[0]?.symbol}
      dtBalance={dtBalance}
      datasetLowPoolLiquidity={!asset.accessDetails?.isPurchasable}
      onClick={handleOrderOrDownload}
      assetTimeout={secondsToString(asset.services[0].timeout)}
      assetType={asset?.metadata?.type}
      stepText={statusText}
      isLoading={isLoading}
      priceType={asset.accessDetails?.type}
      isConsumable={asset.accessDetails?.isPurchasable}
      isBalanceSufficient={isBalanceSufficient}
    />
  )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <FileIcon isLoading={fileIsLoading} />
        </div>
        <div className={styles.pricewrapper}>
          {!isInPurgatory && <PurchaseButton />}
        </div>
      </div>
    </aside>
  )
}
