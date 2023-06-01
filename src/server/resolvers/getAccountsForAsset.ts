import { VaultAccountResponse } from "fireblocks-sdk";

import { getFireblocks } from "~/server/helpers/fireblocks";
import { AccountsForAssetRequest } from "~/lib/schemas";

export const getAccountsForAsset = async ({
  apiKey,
  assetId,
}: AccountsForAssetRequest) => {
  const fireblocks = await getFireblocks(apiKey);

  const accounts: VaultAccountResponse[] = [];

  let after: string | undefined;

  while (true) {
    const res = await fireblocks.getVaultAccountsWithPageInfo({
      assetId,
      minAmountThreshold: 0.00001,
      after,
    });

    accounts.push(...res.accounts);

    after = res.paging?.after;

    if (!after || !res.accounts.length) {
      break;
    }
  }

  if (!accounts.length) {
    throw new Error(`No vault accounts found having asset ${assetId}`);
  }

  accounts.sort((a, b) => {
    const aBalance = a.assets?.find(({ id }) => id === assetId)?.total ?? 0;
    const bBalance = b.assets?.find(({ id }) => id === assetId)?.total ?? 0;

    if (aBalance > bBalance) {
      return -1;
    }

    if (aBalance < bBalance) {
      return 1;
    }

    return 0;
  });

  return accounts;
};
