import { getFireblocks } from "~/server/helpers/fireblocks";
import { AddressRequest } from "~/lib/schemas";

export const getPermanentAddress = async ({
  apiKey,
  assetId,
  accountId,
}: AddressRequest) => {
  const fireblocks = await getFireblocks(apiKey);

  const addresses = await fireblocks.getDepositAddresses(
    String(accountId),
    assetId,
  );

  const permanentAddress =
    addresses.find((a) => a.type === "Permanent") ?? addresses[0];

  return permanentAddress.address;
};
