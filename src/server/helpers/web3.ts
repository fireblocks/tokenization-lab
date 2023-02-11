import path from "path";
import fs from "fs";
import { BrowserProvider } from "ethers";
import { FireblocksWeb3Provider } from "@fireblocks/fireblocks-web3-provider";
import { TransactionRequest } from "~/lib/schemas";
import { getAsset } from "~/lib/assets";

export const getWeb3Provider = async ({
  apiKey,
  assetId,
  account,
}: TransactionRequest) => {
  const privateKeyPath = path.resolve(process.cwd(), "keys", "api.key");

  const privateKey = await fs.promises.readFile(privateKeyPath, "utf-8");

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
