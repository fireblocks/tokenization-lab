import path from "path";
import fs from "fs";
import solc from "solc";
import { ContractFactory, Contract, InterfaceAbi } from "ethers";
import { DeployRequest } from "~/lib/schemas";
import { getContract } from "~/lib/contract";
import { getWeb3Provider } from "../helpers/web3";
import { getBalances } from "../helpers/getBalances";

// We must manually specify the OpenZeppelin contract paths for @vercel/nft to include them in production
const openZeppelinContractPaths = [
  path.join(
    process.cwd(),
    "@openzeppelin",
    "contracts",
    "token",
    "ERC20",
    "ERC20.sol"
  ),
  path.join(
    process.cwd(),
    "@openzeppelin",
    "contracts",
    "token",
    "ERC20",
    "extensions",
    "ERC20Burnable.sol"
  ),
  path.join(
    process.cwd(),
    "@openzeppelin",
    "contracts",
    "access",
    "Ownable.sol"
  ),
];

/**
 * Compile and deploy an ERC-20 token contract, returning account balances.
 *
 * @param deployRequest deployment parameters
 * @returns native asset and token balances
 */
export const deploy = async ({
  name,
  symbol,
  premint,
  assetId,
  apiKey,
  account,
}: DeployRequest) => {
  const { provider, signer } = await getWeb3Provider({
    assetId,
    apiKey,
    account,
  });

  const { solidity, contractName } = getContract({ name, symbol, premint });

  const filename = `${contractName}.sol`;

  try {
    const openZeppelinSources = openZeppelinContractPaths.reduce(
      (sources, contractPath) => ({
        ...sources,
        [contractPath]: { content: fs.readFileSync(contractPath, "utf8") },
      }),
      {} as Record<string, { content: string }>
    );

    const solcInput = {
      language: "Solidity",
      sources: {
        ...openZeppelinSources,
        [filename]: { content: solidity },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(solcInput)));

    const tokenOutput = output.contracts[filename][contractName];

    const abi = tokenOutput.abi as InterfaceAbi;

    const bytecode = tokenOutput.evm.bytecode.object as string;

    const factory = new ContractFactory(abi, bytecode, signer);

    const contract = await factory.deploy();

    await contract.waitForDeployment();

    const contractAddress = contract.target;

    const _contract = new Contract(contractAddress as string, abi, signer);

    const balances = await getBalances(provider, _contract, signer.address);

    return {
      contractAddress,
      abi,
      balances,
    };
  } catch (error) {
    return {
      error,
      contractAddress: "",
      abi: [],
      balances: {
        native: 0,
        token: 0,
      },
      debug: {
        lsContracts: fs.readdirSync(
          path.join(process.cwd(), "node_modules", "@openzeppelin", "contracts")
        ),
        exists: fs.existsSync(
          path.join(
            process.cwd(),
            "node_modules",
            "@openzeppelin",
            "contracts",
            "token"
          )
        ),
        __dirname,
      },
    };
  }
};
