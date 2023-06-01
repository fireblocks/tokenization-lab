import { BigNumberish, Contract, formatEther, Provider } from "ethers";

const formatBalance = (balance: BigNumberish) =>
  parseFloat(formatEther(balance));

export const getBalances = async (
  provider: Provider,
  contract: Contract,
  address: string,
) => {
  const tokenBalanceWei = await contract.balanceOf(address);
  const nativeBalanceWei = await provider.getBalance(address);

  const tokenBalance = formatBalance(tokenBalanceWei);
  const nativeBalance = formatBalance(nativeBalanceWei);

  return {
    native: nativeBalance,
    token: tokenBalance,
  };
};
