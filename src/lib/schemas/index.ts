import { z } from "zod";
import {
  assetIdSchema,
  apiKeySchema,
  addressSchema,
  accountIdSchema,
  amountSchema,
} from "./scalars";

export { assetIdSchema, apiKeySchema };

// Fireblocks API authentication request

export const authRequestSchema = z.object({ apiKey: apiKeySchema });

export type AuthRequest = z.infer<typeof authRequestSchema>;

// Fireblocks vault accounts for asset request

export const accountsForAssetRequestSchema = authRequestSchema.merge(
  z.object({ assetId: assetIdSchema })
);

export type AccountsForAssetRequest = z.infer<
  typeof accountsForAssetRequestSchema
>;

// Fireblocks vault account

const accountPartialSchema = z.object({
  id: accountIdSchema,
  address: addressSchema,
});

export const accountSchema = accountPartialSchema.merge(
  z.object({
    name: z.string().trim().min(1, "Name is required"),
    balances: z.object({
      baseAsset: z
        .number()
        .nonnegative("Base asset balance must not be negative"),
      token: z.number().nonnegative("Token balance must not be negative"),
    }),
  })
);

export type Account = z.infer<typeof accountSchema>;

// Fireblocks deposit address request

export const addressRequestSchema = accountsForAssetRequestSchema.merge(
  z.object({ accountId: accountIdSchema })
);

export type AddressRequest = z.infer<typeof addressRequestSchema>;

// Deployed token contract

const deployedContractSchema = z.object({
  address: z.string().trim().min(1, "Contract address is required"),
  abi: z.any().array(),
});

const tokenMetadataSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  symbol: z.string().trim().min(1, "Symbol is required"),
});

export const contractSchema = deployedContractSchema.merge(tokenMetadataSchema);

export type Contract = z.infer<typeof contractSchema>;

// Build token contract

export const buildContractSchema = tokenMetadataSchema.merge(
  z.object({
    premint: z
      .number({ coerce: true })
      .nonnegative("Premint must not be negative")
      .max(Number.MAX_VALUE, "Premint too large"),
  })
);

export type BuildContract = z.infer<typeof buildContractSchema>;

// Deploy token

const transactionRequestSchema = accountsForAssetRequestSchema.merge(
  z.object({ account: accountPartialSchema })
);

export type TransactionRequest = z.infer<typeof transactionRequestSchema>;

export const deployRequestSchema =
  transactionRequestSchema.merge(buildContractSchema);

export type DeployRequest = z.infer<typeof deployRequestSchema>;

// Mint & burn token

const deployedContractRequestSchema = transactionRequestSchema.merge(
  z.object({ contract: deployedContractSchema })
);

export const mintRequestSchema = deployedContractRequestSchema.merge(
  z.object({ amount: amountSchema })
);

export type MintRequest = z.infer<typeof mintRequestSchema>;

export const burnRequestSchema = deployedContractRequestSchema.merge(
  z.object({ amount: amountSchema })
);

export type BurnRequest = z.infer<typeof burnRequestSchema>;