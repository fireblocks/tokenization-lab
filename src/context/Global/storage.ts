// import {assetI}
// export type AssetId = (typeof assetIds)[number];

// const STORAGE_KEY = "fireblocksAssetId";

// const isAssetId = (assetId: string | null): assetId is AssetId =>
//   assetIds.includes(assetId as AssetId);

// export const getAssetId = () => {
//   const assetId = localStorage.getItem(STORAGE_KEY);

//   if (isAssetId(assetId)) {
//     return assetId;
//   }

//   return assetIds[0];
// };

// export const setAssetId = (assetId: AssetId) =>
//   localStorage.setItem(STORAGE_KEY, assetId);

import { z } from "zod";

export class Storage<T = any> {
  constructor(private key: string, private schema: z.Schema<T>) {}

  get<U extends T | undefined>(fallback?: U): T | U {
    try {
      const stringifiedData = localStorage.getItem(this.key);

      if (stringifiedData === null) {
        return fallback as U;
      }

      try {
        return this.schema.parse(JSON.parse(stringifiedData));
      } catch {
        return this.schema.parse(stringifiedData);
      }
    } catch {
      return fallback as U;
    }
  }

  set(data: T) {
    const parsedData = this.schema.parse(data);

    const stringifiedData =
      typeof parsedData === "string" ? parsedData : JSON.stringify(parsedData);

    localStorage.setItem(this.key, stringifiedData);
  }
}
