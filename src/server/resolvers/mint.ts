import { Contract, ContractTransactionResponse, parseEther } from "ethers";

import { MintRequest } from "~/lib/schemas";
import { getBalances } from "../helpers/getBalances";
import { getWeb3Provider } from "../helpers/web3";

export const mint = async ({
  contract: contractInfo,
  amount,
  ...txInput
}: MintRequest) => {
  const { provider, signer } = await getWeb3Provider(txInput);

  const contract = new Contract(contractInfo.address, contractInfo.abi, signer);

  const wei = parseEther(String(amount));

  const tx = (await contract.mint(
    txInput.account.address,
    wei,
  )) as ContractTransactionResponse;

  await tx.wait();

  const balances = await getBalances(provider, contract, signer.address);

  return { hash: tx.hash, balances };
};
