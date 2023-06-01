import { z } from "zod";

import { assetIds } from "../assets";

export const assetIdSchema = z.enum(assetIds);

export const apiKeySchema = z
  .string()
  .trim()
  .regex(
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    "Invalid API key",
  );

export const addressSchema = z
  .string()
  .trim()
  .min(1, "Address is required")
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address");

export const accountIdSchema = z
  .number()
  .int()
  .nonnegative("Account ID must not be negative");

export const amountSchema = z
  .number()
  .positive("Amount must be positive")
  .max(2 ** 53, "Amount too large");
