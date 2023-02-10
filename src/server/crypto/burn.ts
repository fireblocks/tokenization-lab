import { parseEther, Contract, ContractTransactionResponse } from "ethers";
import { BurnRequest } from "~/lib/schemas";
import { getWeb3Signer } from "./signer";

export const burn = async ({
  contract: contractInfo,
  amount,
  ...txInput
}: BurnRequest) => {
  const signer = await getWeb3Signer(txInput);

  const contract = new Contract(contractInfo.address, contractInfo.abi, signer);

  const wei = parseEther(String(amount));

  const tx = (await contract.burn(wei)) as ContractTransactionResponse;

  //   const tx = (await contract.burnFrom(
  //     account,
  //     wei
  //   )) as ContractTransactionResponse;

  await tx.wait();

  return tx.hash;
};
