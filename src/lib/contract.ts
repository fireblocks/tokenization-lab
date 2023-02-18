import { erc20 } from "@openzeppelin/wizard";
import { BuildContract } from "./schemas";

/**
 * Build an ERC-20 token contract based on an OpenZeppelin template.
 *
 * @see https://wizard.openzeppelin.com
 */
export const getContract = ({ name, symbol, premint }: BuildContract) => {
  const tokenName = name.replace(/"/g, '\\"');
  const contractName = tokenName.replace(/[^a-zA-Z0-9_]+/g, "");

  const solidity = erc20.print({
    name,
    symbol,
    access: "ownable",
    burnable: true,
    mintable: true,
    premint: premint ? premint.toFixed() : undefined,
  });

  return {
    solidity,
    contractName,
  };
};
