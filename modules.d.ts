declare module "solc";

declare module "node_modules-path" {
  export default function getPath(
    moduleName?: string,
    folder?: string[]
  ): string;
}
