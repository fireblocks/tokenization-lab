import { getFireblocks } from "~/server/helpers/fireblocks";
import { assets as staticAssets } from "~/lib/assets";
import { AuthRequest } from "~/lib/schemas/index";

export const orderAssets = <T extends { total: string }>(a: T, b: T) => {
  const aBalance = parseFloat(a.total);
  const bBalance = parseFloat(b.total);

  if (aBalance > bBalance) {
    return -1;
  }

  if (aBalance < bBalance) {
    return 1;
  }

  return 0;
};

export const getAssets = async ({ apiKey }: AuthRequest) => {
  const fireblocks = await getFireblocks(apiKey);

  const assets = await fireblocks.getVaultAssetsBalance({});

  const availabeAssets = assets.filter((asset) =>
    staticAssets.some((a) => a.id === asset.id && !!parseFloat(asset.total)),
  );

  availabeAssets.sort(orderAssets);

  return availabeAssets;
};
