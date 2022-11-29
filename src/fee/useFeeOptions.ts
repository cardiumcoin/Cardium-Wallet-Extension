import { Money } from '@waves/data-entities';
import { useAppSelector } from 'popup/store/react';

import { getFeeOptions } from './utils';

export function useFeeOptions({
  initialFee,
  txType,
}: {
  initialFee: Money;
  txType: number;
}) {
  const assets = useAppSelector(state => state.assets);

  const balance = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    state => state.balances[state.selectedAccount?.address!]
  );

  const feeConfig = useAppSelector(state => state.feeConfig);
  const usdPrices = useAppSelector(state => state.usdPrices);

  return getFeeOptions({
    assets,
    balance,
    feeConfig,
    initialFee,
    txType,
    usdPrices,
  });
}
