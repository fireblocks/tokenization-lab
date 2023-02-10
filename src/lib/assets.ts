export const assets = [
  { id: "AURORA_DEV", name: "Aurora.dev" },
  { id: "AVAX", name: "Avalanche (C-Chain)" },
  { id: "AVALANCHE_FUJI", name: "Avalanche Fuji" },
  { id: "BSC", name: "BNB Smart Chain" },
  { id: "BSC_TEST", name: "BNB Smart Chain Testnet" },
  { id: "CELO", name: "Celo" },
  { id: "CELO_ALFAJORES", name: "Celo Alfajores" },
  { id: "CELO_BAKLAVA", name: "Celo Baklava" },
  { id: "CHZ", name: "Chiliz ($CHZ)" },
  { id: "ETH", name: "Ethereum" },
  { id: "ETH_TEST", name: "Ethereum Test (Ropsten)" },
  { id: "ETH_TEST2", name: "Ethereum Test (Kovan)" },
  { id: "ETH_TEST3", name: "Ethereum Test (Goerli)" },
  { id: "ETH_TEST4", name: "Ethereum Test (Rinkeby)" },
  { id: "ETH_TEST5", name: "Ethereum Test (Sepolia)" },
  { id: "ARB", name: "Arbitrum" },
  { id: "ARBITRUM_RIN", name: "Arbitrum Rinkeby" },
  { id: "OPT", name: "Optimistic Ethereum" },
  { id: "OPTIMISTIC_KOV", name: "Optimistic Ethereum (Kovan)" },
  { id: "ETHW", name: "EthereumPoW" },
  { id: "EVMOS", name: "Evmos" },
  { id: "FTM", name: "Fantom" },
  { id: "GLMR", name: "Moonbeam" },
  { id: "HT", name: "HT Chain" },
  { id: "HT_TEST", name: "HT Chain Test" },
  { id: "POLYGON", name: "Matic Gas Token (Polygon)" },
  { id: "POLYGON_TEST_MUMBAI", name: "Matic Gas Token (Polygon Test)" },
  { id: "MOVR", name: "Moonriver" },
  { id: "RSK", name: "RSK Smart Bitcoin" },
  { id: "RSK_TEST", name: "RSK Smart Bitcoin (Test)" },
  { id: "RON", name: "Ronin" },
  { id: "SONGBIRD", name: "Songbird" },
  { id: "SONGBIRD_LEGACY", name: "Songbird (Legacy derivation)" },
  { id: "SMARTBCH", name: "SmartBCH" },
  { id: "TKX", name: "TokenX" },
  { id: "VLX_TEST", name: "Velas Test (VLX)" },
  { id: "VLX", name: "Velas (VLX)" },
  { id: "XDC", name: "XDC Network" },
] as const;

export type AssetId = (typeof assets)[number]["id"];

export const assetIds: [AssetId, ...AssetId[]] = [
  assets[0].id,
  ...assets.slice(1).map((p) => p.id),
];

export const getAssetName = (assetId: AssetId) =>
  assets.find((asset) => asset.id === assetId)?.name ?? assetId;
