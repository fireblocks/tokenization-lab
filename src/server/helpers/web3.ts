import { FireblocksWeb3Provider } from "@fireblocks/fireblocks-web3-provider";
import { BrowserProvider } from "ethers";

import { getAsset } from "~/lib/assets";
import { TransactionRequest } from "~/lib/schemas";
import { getApiPrivateKey } from "./apiPrivateKey";

export const getWeb3Provider = async ({
  apiKey,
  assetId,
  account,
}: TransactionRequest) => {
  const privateKey = await getApiPrivateKey();

  const asset = getAsset(assetId);

  if (!asset) {
    throw new Error(`Asset ${assetId} not found`);
  }

  const chainId = asset.chainId;

  const eip1193Provider = new FireblocksWeb3Provider({
    privateKey,
    apiKey,
    vaultAccountIds: account.id,
    chainId,
  });

  const provider = new BrowserProvider(eip1193Provider);

  const signer = await provider.getSigner(account.address);

  return { provider, signer };
};
