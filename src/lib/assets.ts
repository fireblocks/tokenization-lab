export const defaultAsset = {
  id: "ETH_TEST3",
  name: "Ethereum Test (Goerli)",
  chainId: 5,
  explorer: "goerli.etherscan.io",
} as const;

export const assets = [
  {
    id: "AVAX",
    name: "Avalanche (C-Chain)",
    chainId: 43114,
    explorer: "snowtrace.io",
  },
  {
    id: "AVALANCHE_FUJI",
    name: "Avalanche Fuji",
    chainId: 43113,
    explorer: "testnet.snowtrace.io",
  },
  {
    id: "BSC",
    name: "BNB Smart Chain",
    chainId: 56,
    explorer: "bscscan.com",
  },
  {
    id: "BSC_TEST",
    name: "BNB Smart Chain Testnet",
    chainId: 97,
    explorer: "testnet.bscscan.com",
  },
  {
    id: "CELO",
    name: "Celo",
    chainId: 42220,
    explorer: "explorer.celo.org/mainnet",
  },
  {
    id: "CELO_ALFAJORES",
    name: "Celo Alfajores",
    chainId: 44787,
    explorer: "explorer.celo.org/alfajores",
  },
  {
    id: "CELO_BAKLAVA",
    name: "Celo Baklava",
    chainId: 62320,
    explorer: "explorer.celo.org/baklava",
  },
  {
    id: "ETH",
    name: "Ethereum",
    chainId: 1,
    explorer: "etherscan.io",
  },
  defaultAsset,
  {
    id: "ETH_TEST5",
    name: "Ethereum Test (Sepolia)",
    chainId: 11155111,
    explorer: "sepolia.etherscan.io",
  },
  {
    id: "ARB",
    name: "Arbitrum",
    chainId: 42161,
    explorer: "arbiscan.io",
  },
  {
    id: "OPT",
    name: "Optimistic Ethereum",
    chainId: 10,
    explorer: "optimistic.etherscan.io",
  },
  { id: "ETHW", name: "EthereumPoW", chainId: 10001, explorer: null },
  { id: "EVMOS", name: "Evmos", chainId: 9001, explorer: null },
  { id: "FTM", name: "Fantom", chainId: 250, explorer: null },
  { id: "GLMR", name: "Moonbeam", chainId: 1284, explorer: null },
  {
    id: "POLYGON",
    name: "Matic Gas Token (Polygon)",
    chainId: 137,
    explorer: "polygonscan.com",
  },
  {
    id: "POLYGON_TEST_MUMBAI",
    name: "Matic Gas Token (Polygon Test)",
    chainId: 80001,
    explorer: "mumbai.polygonscan.com",
  },
  { id: "MOVR", name: "Moonriver", chainId: 1285, explorer: null },
  { id: "RSK", name: "RSK Smart Bitcoin", chainId: 30, explorer: null },
  {
    id: "RSK_TEST",
    name: "RSK Smart Bitcoin (Test)",
    chainId: 31,
    explorer: null,
  },
  { id: "RON", name: "Ronin", chainId: 2020, explorer: null },
  { id: "SONGBIRD", name: "Songbird", chainId: 19, explorer: null },
  {
    id: "SONGBIRD_LEGACY",
    name: "Songbird (Legacy derivation)",
    chainId: 19,
    explorer: null,
  },
  { id: "SMARTBCH", name: "SmartBCH", chainId: 10000, explorer: null },
  { id: "VLX_TEST", name: "Velas Test (VLX)", chainId: 111, explorer: null },
  { id: "VLX", name: "Velas (VLX)", chainId: 106, explorer: null },
  { id: "XDC", name: "XDC Network", chainId: 50, explorer: null },
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
