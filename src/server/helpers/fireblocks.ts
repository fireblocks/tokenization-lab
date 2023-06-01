import { FireblocksSDK } from "fireblocks-sdk";

import { getApiPrivateKey } from "./apiPrivateKey";

export const getFireblocks = async (apiKey: string) => {
  const privateKey = await getApiPrivateKey();

  const fireblocks = new FireblocksSDK(privateKey, apiKey);

  return fireblocks;
};
