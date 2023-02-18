import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "~/server/trpc";
import {
  getAssets,
  getAccountsForAsset,
  getPermanentAddress,
  deploy,
  mint,
  burn,
} from "~/server/resolvers";
import { timeoutResolver } from "~/server/helpers/timeoutResolver";
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
    .mutation(timeoutResolver(getAssets)),
  accountsForAsset: publicProcedure
    .input(accountsForAssetRequestSchema)
    .query(timeoutResolver(getAccountsForAsset)),
  getPermanentAddress: publicProcedure
    .input(addressRequestSchema)
    .query(timeoutResolver(getPermanentAddress)),
  deploy: publicProcedure
    .input(deployRequestSchema)
    .mutation(timeoutResolver(deploy)),
  mint: publicProcedure
    .input(mintRequestSchema)
    .mutation(timeoutResolver(mint)),
  burn: publicProcedure
    .input(burnRequestSchema)
    .mutation(timeoutResolver(burn)),
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
