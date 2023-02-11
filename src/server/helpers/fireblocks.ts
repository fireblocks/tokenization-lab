import path from "path";
import fs from "fs";
import { FireblocksSDK } from "fireblocks-sdk";

const PRIVATE_KEY_B64 = process.env.PRIVATE_KEY_B64;

export const getFireblocks = async (apiKey: string) => {
  let privateKey: string;

  if (PRIVATE_KEY_B64) {
    privateKey = Buffer.from(PRIVATE_KEY_B64, "base64").toString("utf-8");
  } else {
    const privateKeyPath = path.resolve(process.cwd(), "keys", "api.key");

    privateKey = await fs.promises.readFile(privateKeyPath, "utf-8");
  }

  if (!privateKey) {
    throw new Error("No API private key found");
  }

  const fireblocks = new FireblocksSDK(privateKey, apiKey);

  return fireblocks;
};
