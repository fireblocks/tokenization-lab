import { initTRPC } from "@trpc/server";
import { timeoutResolver } from "~/server/helpers/timeoutResolver";
import {
  getAssets,
  getAccountsForAsset,
  getPermanentAddress,
  deploy,
  mint,
  burn,
} from "~/server/resolvers";
import {
  authRequestSchema,
  accountsForAssetRequestSchema,
  addressRequestSchema,
  deployRequestSchema,
  mintRequestSchema,
  burnRequestSchema,
} from "~/lib/schemas";

const t = initTRPC.create();

const input = t.procedure.input;

export const appRouter = t.router({
  assets: input(authRequestSchema).mutation(timeoutResolver(getAssets)),
  accountsForAsset: input(accountsForAssetRequestSchema).query(
    timeoutResolver(getAccountsForAsset)
  ),
  getPermanentAddress: input(addressRequestSchema).query(
    timeoutResolver(getPermanentAddress)
  ),
  deploy: input(deployRequestSchema).mutation(timeoutResolver(deploy)),
  mint: t.procedure.input(mintRequestSchema).mutation(timeoutResolver(mint)),
  burn: t.procedure.input(burnRequestSchema).mutation(timeoutResolver(burn)),
});

export type AppRouter = typeof appRouter;
