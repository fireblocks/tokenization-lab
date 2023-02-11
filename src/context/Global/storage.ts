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