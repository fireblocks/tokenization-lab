import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { AssetId, assetIds } from "~/lib/assets";
import {
  Account,
  Contract,
  assetIdSchema,
  apiKeySchema,
  accountSchema,
  contractSchema,
} from "~/lib/schemas";
import { Storage } from "./storage";

const assetIdStorage = new Storage("fireblocksAssetId", assetIdSchema);
const apiKeyStorage = new Storage("fireblocksApiKey", apiKeySchema);
const accountStorage = new Storage("fireblocksAccount", accountSchema);
const contractStorage = new Storage("fireblocksContract", contractSchema);

interface IGlobalContext {
  assetId: AssetId;
  apiKey?: string;
  account?: Account;
  contract?: Contract;
  setAssetId: (assetId: AssetId) => void;
  setApiKey: (apiKey: string) => void;
  setAccount: (account: Account) => void;
  setContract: (contract: Contract) => void;
  reset: VoidFunction;
}

const defaultValue: IGlobalContext = {
  assetId: "ETH_TEST3",
  apiKey: undefined,
  account: undefined,
  contract: undefined,
  setAssetId: () => undefined,
  setApiKey: () => undefined,
  setAccount: () => undefined,
  setContract: () => undefined,
  reset: () => undefined,
};

const Context = createContext(defaultValue);

type Props = {
  children: ReactNode;
};

export const GlobalContextProvider = ({ children }: Props) => {
  const [state, setState] = useState<IGlobalContext>(defaultValue);

  const router = useRouter();

  useEffect(() => {
    if (router.pathname !== "/" && !state.apiKey) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, state.apiKey]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      assetId: assetIdStorage.get(assetIds[0]),
      apiKey: apiKeyStorage.get(),
      account: accountStorage.get(),
      contract: contractStorage.get(),
    }));
  }, []);

  const setStoredState = <T = any,>(
    storage: Storage<T>,
    key: keyof IGlobalContext,
    value: T
  ) => {
    try {
      storage.set(value);

      setState((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error(error);
    }
  };

  const setAssetId = (assetId: AssetId) =>
    setStoredState(assetIdStorage, "assetId", assetId);

  const setApiKey = (apiKey: string) =>
    setStoredState(apiKeyStorage, "apiKey", apiKey);

  const setAccount = (account: Account) =>
    setStoredState(accountStorage, "account", account);

  const setContract = (contract: Contract) =>
    setStoredState(contractStorage, "contract", contract);

  const reset = () => setState(defaultValue);

  const value: IGlobalContext = {
    ...state,
    setAssetId,
    setApiKey,
    setAccount,
    setContract,
    reset,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useGlobalContext = () => useContext(Context);
