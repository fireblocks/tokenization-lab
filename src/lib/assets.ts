import { ChainId } from "@fireblocks/fireblocks-web3-provider/dist/src/types";

export const defaultAsset = {
  id: "MATIC_POLYGON_MUMBAI",
  name: "Matic Gas Token (Polygon Test)",
  chainId: 80001,
  explorer: "mumbai.polygonscan.com",
} as const;

export const assets = [
  {
    id: "AVAX",
    name: "Avalanche (C-Chain)",
    chainId: ChainId.AVALANCHE,
    explorer: "snowtrace.io",
  },
  {
    id: "AVAXTEST",
    name: "Avalanche Fuji",
    chainId: ChainId.AVALANCHE_TEST,
    explorer: "testnet.snowtrace.io",
  },
  {
    id: "BNB_BSC",
    name: "BNB Smart Chain",
    chainId: ChainId.BSC,
    explorer: "bscscan.com",
  },
  {
    id: "BNB_TEST",
    name: "BNB Smart Chain Testnet",
    chainId: ChainId.BSC_TEST,
    explorer: "testnet.bscscan.com",
  },
  {
    id: "CELO",
    name: "Celo",
    chainId: ChainId.CELO,
    explorer: "explorer.celo.org/mainnet",
  },
  {
    id: "CELO_ALF",
    name: "Celo Alfajores",
    chainId: ChainId.CELO_ALF,
    explorer: "explorer.celo.org/alfajores",
  },
  {
    id: "CELO_BAK",
    name: "Celo Baklava",
    chainId: ChainId.CELO_BAK,
    explorer: "explorer.celo.org/baklava",
  },
  {
    id: "ETH",
    name: "Ethereum",
    chainId: ChainId.MAINNET,
    explorer: "etherscan.io",
  },
  {
    id: "ETH_TEST3",
    name: "Ethereum Test (Goerli)",
    chainId: ChainId.GOERLI,
    explorer: "goerli.etherscan.io",
  },
  {
    id: "ETH_TEST5",
    name: "Ethereum Test (Sepolia)",
    chainId: ChainId.SEPOLIA,
    explorer: "sepolia.etherscan.io",
  },
  {
    id: "ETH-AETH",
    name: "Arbitrum",
    chainId: ChainId.ARBITRUM,
    explorer: "arbiscan.io",
  },
  {
    id: "ETH-OPT",
    name: "Optimistic Ethereum",
    chainId: ChainId.OPTIMISM,
    explorer: "optimistic.etherscan.io",
  },
  {
    id: "FTM",
    name: "Fantom",
    chainId: ChainId.FANTOM,
    explorer: null,
  },
  {
    id: "GLMR_GLMR",
    name: "Moonbeam",
    chainId: ChainId.MOONBEAM,
    explorer: null,
  },
  {
    id: "MATIC",
    name: "Matic Gas Token (Polygon)",
    chainId: ChainId.POLYGON,
    explorer: "polygonscan.com",
  },
  defaultAsset,
  {
    id: "MOVR_MOVR",
    name: "Moonriver",
    chainId: ChainId.MOONRIVER,
    explorer: null,
  },
  {
    id: "RBTC",
    name: "RSK Smart Bitcoin",
    chainId: ChainId.RSK,
    explorer: null,
  },
  {
    id: "RON",
    name: "Ronin",
    chainId: ChainId.RONIN,
    explorer: null,
  },
  {
    id: "SGB",
    name: "Songbird",
    chainId: ChainId.SONGBIRD,
    explorer: null,
  },
] as const;

export type Asset = (typeof assets)[number];

export type AssetId = Asset["id"];

export const assetIds: [AssetId, ...AssetId[]] = [
  assets[0].id,
  ...assets.slice(1).map((p) => p.id),
];

export const getAsset = (assetId: string) =>
  assets.find((asset) => asset.id === assetId) as
    | (typeof assets)[number]
    | undefined;
