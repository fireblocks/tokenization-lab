import path from "path";
import fs from "fs";
import { BrowserProvider } from "ethers";
import {
  FireblocksWeb3Provider,
  ChainId,
} from "@fireblocks/fireblocks-web3-provider";
import { TransactionRequest } from "~/lib/schemas";

export const getWeb3Signer = async ({
  apiKey,
  assetId,
  account,
}: TransactionRequest) => {
  const privateKeyPath = path.resolve(process.cwd(), "keys", "api.key");

  const privateKey = await fs.promises.readFile(privateKeyPath, "utf-8");

  let chainId: ChainId;

  switch (assetId) {
    default:
    case "ETH_TEST3":
      chainId = ChainId.GOERLI;
      break;
  }

  const eip1193Provider = new FireblocksWeb3Provider({
    privateKey,
    apiKey,
    vaultAccountIds: account.id,
    chainId,
  });

  const provider = new BrowserProvider(eip1193Provider);

  const signer = await provider.getSigner(account.address);

  return signer;
};
