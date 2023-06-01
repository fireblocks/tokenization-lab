import { Contract, ContractTransactionResponse, parseEther } from "ethers";

import { BurnRequest } from "~/lib/schemas";
import { getBalances } from "../helpers/getBalances";
import { getWeb3Provider } from "../helpers/web3";

export const burn = async ({
  contract: contractInfo,
  amount,
  ...txInput
}: BurnRequest) => {
  const { provider, signer } = await getWeb3Provider(txInput);

  const contract = new Contract(contractInfo.address, contractInfo.abi, signer);

  const wei = parseEther(String(amount));

  const tx = (await contract.burn(wei)) as ContractTransactionResponse;

  // const tx = (await contract.burnFrom(
  //   account,
  //   wei
  // )) as ContractTransactionResponse;

  await tx.wait();

  const balances = await getBalances(provider, contract, signer.address);

  return { hash: tx.hash, balances };
};
