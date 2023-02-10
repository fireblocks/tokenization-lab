import { getContract } from "~/lib/contract";
import path from "path";
import fs from "fs";
import solc from "solc";
import { ContractFactory, InterfaceAbi } from "ethers";
import { getWeb3Signer } from "./signer";
import { DeployRequest } from "~/lib/schemas";

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
  const signer = await getWeb3Signer(txInput);

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

  return { contractAddress, abi };
};
