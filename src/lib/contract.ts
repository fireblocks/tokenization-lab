import { erc20 } from "@openzeppelin/wizard";
import { BuildContract } from "./schemas";

/**
 * Build an ERC-20 token contract based on an OpenZeppelin template.
 *
 * @see https://wizard.openzeppelin.com
 */
export const getContract = ({ name, symbol, premint }: BuildContract) =>
  erc20.print({
    name,
    symbol,
    access: "ownable",
    burnable: true,
    mintable: true,
    premint: premint ? String(premint) : undefined,
  });
