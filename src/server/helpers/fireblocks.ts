import path from "path";
import fs from "fs";
import { FireblocksSDK } from "fireblocks-sdk";

export const getFireblocks = async (apiKey: string) => {
  const privateKeyPath = path.resolve(process.cwd(), "keys", "api.key");

  const privateKey = await fs.promises.readFile(privateKeyPath, "utf-8");

  const fireblocks = new FireblocksSDK(privateKey, apiKey);

  return fireblocks;
};
