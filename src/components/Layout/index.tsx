import { useRouter } from "next/router";
import { ReactNode, ForwardRefExoticComponent, SVGProps } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import {
  ArrowUpCircleIcon,
  PlusCircleIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useGlobalContext } from "~/context/Global";
import { getAsset } from "~/lib/assets";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  const { pathname } = useRouter();

  const { apiKey, assetId, assetName, account, contract, reset } =
    useGlobalContext();

  const accountName = account?.name || account?.id;

  const asset = assetId ? getAsset(assetId) : null;

  const assetExplorer = asset?.explorer;

  const accountAddress = account?.address;

  const tokenAddress = contract?.address;

  const accountExplorer =
    assetExplorer && accountAddress
      ? `https://${assetExplorer}/address/${accountAddress}`
      : null;

  const tokenExplorer =
    assetExplorer && tokenAddress
      ? `https://${assetExplorer}/token/${tokenAddress}`
      : null;

  const tokenBalanceExplorer =
    assetExplorer && accountAddress && tokenAddress
      ? `https://${assetExplorer}/token/${tokenAddress}?a=${accountAddress}`
      : null;

  const navItem = (
    name: string,
    icon: ForwardRefExoticComponent<
      SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
    >
  ) => {
    const href = `/${name.toLowerCase()}`;

    return {
      name,
      icon,
      href,
      current: pathname === href,
    };
  };

  const navigation = [];

  if (apiKey && account) {
    navigation.push(navItem("Deploy", ArrowUpCircleIcon));
  }

  if (contract) {
    navigation.push(navItem("Mint", PlusCircleIcon), navItem("Burn", FireIcon));
  }

  return (
    <div className="container mx-auto font-sans sm:py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-5 lg:px-8">
      <aside className="space-y-4 py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
        <div className="flex flex-shrink-0 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 26 25"
            className="mr-3 h-12 w-auto"
          >
            <path
              fill="#123c66"
              fillRule="nonzero"
              d="M24.322 0a1 1 0 0 1 1 1v23a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h23.322ZM12.661 6.944 5.627 18.056h14.068L12.66 6.944h.001Z"
            />
          </svg>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Fireblocks Tokenization Lab
          </h3>
        </div>
        {!!(assetName && account) && (
          <div className="rounded border border-gray-300 p-3">
            {!!assetName && (
              <p className="truncate text-sm text-gray-500">
                <span className="font-medium text-gray-700">Network</span>{" "}
                <span>{assetName}</span>
              </p>
            )}
            {!!accountName && (
              <p className="mt-1 truncate text-sm text-gray-500">
                <span className="font-medium text-gray-700">Account</span>{" "}
                <span>{accountName}</span>
              </p>
            )}
            {!!accountAddress && (
              <p className="mt-1 truncate text-sm text-gray-500">
                <span className="font-medium text-gray-700">Address</span>{" "}
                <a
                  className="font-mono text-blue-500 hover:text-blue-700"
                  href={accountExplorer ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {accountAddress}
                </a>
              </p>
            )}
            {!!tokenAddress && (
              <p className="mt-1 truncate text-sm text-gray-500">
                <span className="font-medium text-gray-700">Contract</span>{" "}
                <a
                  className="font-mono text-blue-500 hover:text-blue-700"
                  href={tokenExplorer ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tokenAddress}
                </a>
              </p>
            )}
            {!!account.balances && (
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-700">Balances</span>
                <div className="ml-1 flex flex-col truncate text-right">
                  <a
                    className="truncate font-mono text-blue-500 hover:text-blue-700"
                    href={accountExplorer ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {account.balances.native.toFixed(4)} Native
                  </a>
                  {!!contract && (
                    <a
                      className="mt-1 truncate font-mono text-blue-500 hover:text-blue-700"
                      href={tokenBalanceExplorer ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {account.balances.token.toFixed(4)} {contract.symbol}
                    </a>
                  )}
                </div>
              </div>
            )}
            <hr className="my-3 border-gray-200" />
            <div className="space-x-2">
              <Link
                href="/"
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </Link>
              <button
                type="button"
                className="inline-flex items-center rounded border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={reset}
              >
                Reset
              </button>
            </div>
          </div>
        )}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                item.current
                  ? "bg-white text-blue-700 hover:bg-white hover:text-blue-700"
                  : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={clsx(
                  item.current
                    ? "text-blue-500 group-hover:text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">{children}</div>
    </div>
  );
};
