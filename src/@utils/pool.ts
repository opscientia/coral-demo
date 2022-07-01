import { approve, Pool, PoolPriceAndFees } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getDummyWeb3 } from './web3'
import { TransactionReceipt } from 'web3-eth'
import Decimal from 'decimal.js'
import { AccessDetails } from 'src/@types/Price'
import { consumeMarketPoolSwapFee, marketFeeAddress } from '../../app.config'

/**
 *  This is used to calculate the actual price of buying a datatoken, it's a copy of the math in the contracts.
 * @param params
 * @returns
 */
export function calcInGivenOut(params: CalcInGivenOutParams): PoolPriceAndFees {
  const result = {
    tokenAmount: '0',
    liquidityProviderSwapFeeAmount: '0',
    oceanFeeAmount: '0',
    publishMarketSwapFeeAmount: '0',
    consumeMarketSwapFeeAmount: '0'
  } as PoolPriceAndFees
  const one = new Decimal(1)
  const tokenOutLiqudity = new Decimal(params.tokenOutLiquidity)
  const tokenInLiquidity = new Decimal(params.tokenInLiquidity)
  const tokenOutAmount = new Decimal(params.tokenOutAmount)
  const opcFee = new Decimal(params.opcFee)
  const lpFee = new Decimal(params.lpSwapFee)
  const publishMarketSwapFee = new Decimal(params.publishMarketSwapFee)
  const consumeMarketSwapFee = new Decimal(params.consumeMarketSwapFee)

  const diff = tokenOutLiqudity.minus(tokenOutAmount)
  const y = tokenOutLiqudity.div(diff)
  let foo = y.pow(one)
  foo = foo.minus(one)
  const totalFee = lpFee
    .plus(opcFee)
    .plus(publishMarketSwapFee)
    .plus(consumeMarketSwapFee)

  const tokenAmountIn = tokenInLiquidity.mul(foo).div(one.sub(totalFee))
  result.tokenAmount = tokenAmountIn.toString()
  result.oceanFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(opcFee)))
    .toString()
  result.publishMarketSwapFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(publishMarketSwapFee)))
    .toString()
  result.consumeMarketSwapFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(consumeMarketSwapFee)))
    .toString()
  result.liquidityProviderSwapFeeAmount = tokenAmountIn
    .sub(tokenAmountIn.mul(one.sub(lpFee)))
    .toString()

  return result
}

/**
 * Used to calculate swap values, it's a copy of the math in the contracts.
 * @param tokenLiquidity
 * @param poolSupply
 * @param poolShareAmount
 * @returns
 */
export function calcSingleOutGivenPoolIn(
  tokenLiquidity: string,
  poolSupply: string,
  poolShareAmount: string
): string {
  const tokenLiquidityD = new Decimal(tokenLiquidity)
  const poolSupplyD = new Decimal(poolSupply)
  const poolShareAmountD = new Decimal(poolShareAmount).mul(2)
  const newPoolSupply = poolSupplyD.sub(poolShareAmountD)
  const poolRatio = newPoolSupply.div(poolSupplyD)

  const tokenOutRatio = new Decimal(1).sub(poolRatio)
  const newTokenBalanceOut = tokenLiquidityD.mul(tokenOutRatio)
  return newTokenBalanceOut.toString()
}

/**
 * Returns the amount of tokens (based on tokenAddress) that can be withdrawn from the pool
 * @param {string} poolAddress
 * @param {string} tokenAddress
 * @param {string} shares
 * @param {number} chainId
 * @returns
 */
export async function getLiquidityByShares(
  pool: string,
  tokenAddress: string,
  tokenDecimals: number,
  shares: string,
  chainId: number
): Promise<string> {
  // we only use the dummyWeb3 connection here
  const web3 = await getDummyWeb3(chainId)

  const poolInstance = new Pool(web3)
  // get shares VL in ocean
  const amountBaseToken = await poolInstance.calcSingleOutGivenPoolIn(
    pool,
    tokenAddress,
    shares,
    18,
    tokenDecimals
  )

  return amountBaseToken
}
