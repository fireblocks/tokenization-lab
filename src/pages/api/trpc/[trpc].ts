import { VaultAccountResponse } from "fireblocks-sdk";
import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "~/server/trpc";
import { getFireblocks } from "~/server/fireblocks";
import { deploy } from "~/server/crypto/deploy";
import { mint } from "~/server/crypto/mint";
import { burn } from "~/server/crypto/burn";
import {
  authRequestSchema,
  accountsForAssetRequestSchema,
  addressRequestSchema,
  deployRequestSchema,
  mintRequestSchema,
  burnRequestSchema,
} from "~/lib/schemas";

const appRouter = router({
  assets: publicProcedure.input(authRequestSchema).query(async ({ input }) => {
    const fireblocks = await getFireblocks(input.apiKey);

    const assets = await fireblocks.getVaultAssetsBalance({});

    return assets;
  }),
  accountsForAsset: publicProcedure
    .input(accountsForAssetRequestSchema)
    .query(async ({ input }) => {
      const fireblocks = await getFireblocks(input.apiKey);

      const accounts: VaultAccountResponse[] = [];

      let after: string | undefined;

      while (true) {
        const res = await fireblocks.getVaultAccountsWithPageInfo({
          assetId: input.assetId,
          minAmountThreshold: 0.00001,
          after,
        });

        accounts.push(...res.accounts);

        after = res.paging?.after;

        if (!after || !res.accounts.length) {
          break;
        }
      }

      if (!accounts.length) {
        throw new Error(
          `No vault accounts found having asset ${input.assetId}`
        );
      }

      return accounts;
    }),
  address: publicProcedure
    .input(addressRequestSchema)
    .query(async ({ input }) => {
      const fireblocks = await getFireblocks(input.apiKey);

      const addresses = await fireblocks.getDepositAddresses(
        String(input.accountId),
        input.assetId
      );

      const permanentAddress = addresses.find((a) => a.type === "Permanent");

      return permanentAddress?.address;
    }),
  deploy: publicProcedure
    .input(deployRequestSchema)
    .mutation(async ({ input }) => deploy(input)),
  mint: publicProcedure
    .input(mintRequestSchema)
    .mutation(async ({ input }) => mint(input)),
  burn: publicProcedure
    .input(burnRequestSchema)
    .mutation(async ({ input }) => burn(input)),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
