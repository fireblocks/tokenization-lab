import { parseEther, Contract, ContractTransactionResponse } from "ethers";
import { MintRequest } from "~/lib/schemas";
import { getWeb3Signer } from "./signer";

export const mint = async ({
  contract: contractInfo,
  amount,
  ...txInput
}: MintRequest) => {
  const signer = await getWeb3Signer(txInput);

  const contract = new Contract(contractInfo.address, contractInfo.abi, signer);

  const wei = parseEther(String(amount));

  const tx = (await contract.mint(
    txInput.account.address,
    wei
  )) as ContractTransactionResponse;

  await tx.wait();

  return tx.hash;
};
