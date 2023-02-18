import solc from "solc";
import { ContractFactory, Contract, InterfaceAbi } from "ethers";
import { DeployRequest } from "~/lib/schemas";
import { getContract } from "~/lib/contract";
import { getWeb3Provider } from "../helpers/web3";
import { getBalances } from "../helpers/getBalances";
import Context from "@openzeppelin/contracts/utils/Context.sol";
import Ownable from "@openzeppelin/contracts/access/Ownable.sol";
import IERC20 from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import IERC20Metadata from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import ERC20 from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import ERC20Burnable from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

const FILENAME = "Token.sol";

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

  const solidity = getContract({ name, symbol, premint });

  const solcInput = {
    language: "Solidity",
    sources: {
      [FILENAME]: { content: solidity },
      "@openzeppelin/contracts/utils/Context.sol": { content: Context },
      "@openzeppelin/contracts/access/Ownable.sol": { content: Ownable },
      "@openzeppelin/contracts/token/ERC20/IERC20.sol": { content: IERC20 },
      "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol": {
        content: IERC20Metadata,
      },
      "@openzeppelin/contracts/token/ERC20/ERC20.sol": { content: ERC20 },
      "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol": {
        content: ERC20Burnable,
      },
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

  if (output.errors?.length) {
    throw output.errors[0];
  }

  const fileOutput = output.contracts[FILENAME];

  const contractName = Object.keys(fileOutput)[0];

  const tokenOutput = fileOutput[contractName];

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
};
