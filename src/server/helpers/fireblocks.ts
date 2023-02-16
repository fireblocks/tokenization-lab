import path from "path";
import fs from "fs";
import { FireblocksSDK } from "fireblocks-sdk";

const PRIVATE_KEY_B64 = process.env.PRIVATE_KEY_B64;

const PRIVATE_KEY_ERROR = new Error("No API private key found");

export const getFireblocks = async (apiKey: string) => {
  let privateKey: string;

  console.info(
    "Is private key env var set?",
    PRIVATE_KEY_B64?.length ? "Yes" : "No"
  );

  const privateKeyPath = path.resolve(process.cwd(), "keys", "api.key");

  if (PRIVATE_KEY_B64?.length) {
    privateKey = Buffer.from(PRIVATE_KEY_B64, "base64").toString("utf-8");
  } else if (fs.existsSync(privateKeyPath)) {
    privateKey = await fs.promises.readFile(privateKeyPath, "utf-8");
  } else {
    throw PRIVATE_KEY_ERROR;
  }

  if (!privateKey) {
    throw PRIVATE_KEY_ERROR;
  }

  const fireblocks = new FireblocksSDK(privateKey, apiKey);

  return fireblocks;
};
