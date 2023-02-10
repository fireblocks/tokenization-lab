import { BuildContract } from "./schemas";

/**
 * Build an ERC-20 token contract based on an OpenZeppelin template.
 *
 * @see https://wizard.openzeppelin.com
 */
export const getContract = ({ name, symbol, premint }: BuildContract) => {
  const tokenSymbol = symbol.replace(/"/g, '\\"');
  const tokenName = name.replace(/"/g, '\\"');
  const contractName = tokenName.replace(/[^a-zA-Z0-9_]+/g, "");

  const solidity = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${contractName} is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("${tokenName}", "${tokenSymbol}") {${
    typeof premint === "number" && !!premint
      ? `
        _mint(msg.sender, ${premint} * 10 ** decimals());
    `
      : ""
  }}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
`;

  return {
    solidity,
    contractName,
  };
};
