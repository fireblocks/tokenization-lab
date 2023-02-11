import path from "path";
import fs from "fs";
import solc from "solc";
import { ContractFactory, Contract, InterfaceAbi } from "ethers";
import { DeployRequest } from "~/lib/schemas";
import { getContract } from "~/lib/contract";
import { getWeb3Provider } from "../helpers/web3";
import { getBalances } from "../helpers/getBalances";

const findImports = (relativePath: string) => {
  const absolutePath = path.resolve(
    process.cwd(),
    "node_modules",
    relativePath
  );
  const source = fs.readFileSync(absolutePath, "utf8");
  return { contents: source };
};

export const deploy = async ({
  name,
  symbol,
  premint,
  ...txInput
}: DeployRequest) => {
  const { provider, signer } = await getWeb3Provider(txInput);

  const { solidity, contractName } = getContract({ name, symbol, premint });

  const filename = `${contractName}.sol`;

  const solcInput = {
    language: "Solidity",
    sources: {
      [filename]: {
        content: solidity,
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

  const output = JSON.parse(
    solc.compile(JSON.stringify(solcInput), { import: findImports })
  );

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
};
