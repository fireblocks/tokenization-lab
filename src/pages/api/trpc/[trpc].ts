import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "~/server/trpc";
import {
  getAssets,
  getAccountsForAsset,
  getPermanentAddress,
  deploy,
  mint,
  burn,
} from "~/server/handlers";
import {
  authRequestSchema,
  accountsForAssetRequestSchema,
  addressRequestSchema,
  deployRequestSchema,
  mintRequestSchema,
  burnRequestSchema,
} from "~/lib/schemas";

const appRouter = router({
  assets: publicProcedure
    .input(authRequestSchema)
    .mutation(async ({ input }) => getAssets(input)),
  accountsForAsset: publicProcedure
    .input(accountsForAssetRequestSchema)
    .query(async ({ input }) => getAccountsForAsset(input)),
  getPermanentAddress: publicProcedure
    .input(addressRequestSchema)
    .query(async ({ input }) => getPermanentAddress(input)),
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
