export const defaultAsset = {
  id: "ETH_TEST3",
  name: "Ethereum Test (Goerli)",
  chainId: 5,
} as const;

export const assets = [
  { id: "AVAX", name: "Avalanche (C-Chain)", chainId: 43114 },
  {
    id: "AVALANCHE_FUJI",
    name: "Avalanche Fuji",
    chainId: 43113,
  },
  { id: "BSC", name: "BNB Smart Chain", chainId: 56 },
  {
    id: "BSC_TEST",
    name: "BNB Smart Chain Testnet",
    chainId: 97,
  },
  { id: "CELO", name: "Celo", chainId: 42220 },
  { id: "CELO_ALFAJORES", name: "Celo Alfajores", chainId: 44787 },
  { id: "CELO_BAKLAVA", name: "Celo Baklava", chainId: 62320 },
  { id: "ETH", name: "Ethereum", chainId: 1 },
  { id: "ETH_TEST", name: "Ethereum Test (Ropsten)", chainId: 3 },
  { id: "ETH_TEST2", name: "Ethereum Test (Kovan)", chainId: 42 },
  defaultAsset,
  {
    id: "ETH_TEST4",
    name: "Ethereum Test (Rinkeby)",
    chainId: 4,
  },
  { id: "ETH_TEST5", name: "Ethereum Test (Sepolia)", chainId: 11155111 },
  { id: "ARB", name: "Arbitrum", chainId: 42161 },
  { id: "ARBITRUM_RIN", name: "Arbitrum Rinkeby", chainId: 421611 },
  { id: "OPT", name: "Optimistic Ethereum", chainId: 10 },
  {
    id: "OPTIMISTIC_KOV",
    name: "Optimistic Ethereum (Kovan)",
    chainId: 69,
  },
  { id: "ETHW", name: "EthereumPoW", chainId: 10001 },
  { id: "EVMOS", name: "Evmos", chainId: 9001 },
  { id: "FTM", name: "Fantom", chainId: 250 },
  { id: "GLMR", name: "Moonbeam", chainId: 1284 },
  {
    id: "POLYGON",
    name: "Matic Gas Token (Polygon)",
    chainId: 137,
  },
  {
    id: "POLYGON_TEST_MUMBAI",
    name: "Matic Gas Token (Polygon Test)",
    chainId: 80001,
  },
  { id: "MOVR", name: "Moonriver", chainId: 1285 },
  { id: "RSK", name: "RSK Smart Bitcoin", chainId: 30 },
  {
    id: "RSK_TEST",
    name: "RSK Smart Bitcoin (Test)",
    chainId: 31,
  },
  { id: "RON", name: "Ronin", chainId: 2020 },
  { id: "SONGBIRD", name: "Songbird", chainId: 19 },
  {
    id: "SONGBIRD_LEGACY",
    name: "Songbird (Legacy derivation)",
    chainId: 19,
  },
  { id: "SMARTBCH", name: "SmartBCH", chainId: 10000 },
  { id: "VLX_TEST", name: "Velas Test (VLX)", chainId: 111 },
  { id: "VLX", name: "Velas (VLX)", chainId: 106 },
  { id: "XDC", name: "XDC Network", chainId: 50 },
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
