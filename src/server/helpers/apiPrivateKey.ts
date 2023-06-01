import fs from "fs";
import path from "path";

const PRIVATE_KEY_B64 = process.env.PRIVATE_KEY_B64;

const PRIVATE_KEY_PATH = path.join(process.cwd(), "api.key");

const PRIVATE_KEY_ERROR = new Error("No API private key found");

export const getApiPrivateKey = async () => {
  let privateKey: string;

  if (PRIVATE_KEY_B64?.length) {
    privateKey = Buffer.from(PRIVATE_KEY_B64, "base64").toString("utf-8");
  } else if (fs.existsSync(PRIVATE_KEY_PATH)) {
    privateKey = await fs.promises.readFile(PRIVATE_KEY_PATH, "utf-8");
  } else {
    throw PRIVATE_KEY_ERROR;
  }

  privateKey = privateKey.trim();

  if (!privateKey.length) {
    throw PRIVATE_KEY_ERROR;
  }

  return privateKey;
};
