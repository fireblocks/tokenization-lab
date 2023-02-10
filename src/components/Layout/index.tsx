import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { ReactNode, ForwardRefExoticComponent, SVGProps } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import {
  ArrowUpCircleIcon,
  PlusCircleIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useGlobalContext } from "~/context/Global";
import { getAssetName } from "~/lib/assets";

type Props = {
  children: ReactNode;
};

const inter = Inter({ variable: "--font-inter" });

export const Layout = ({ children }: Props) => {
  const { pathname } = useRouter();

  const { apiKey, assetId, account, contract } = useGlobalContext();

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

  const assetName = getAssetName(assetId);

  return (
    <div
      className={`${inter.variable} container mx-auto font-sans sm:py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-5 lg:px-8`}
    >
      <aside className="space-y-4 py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
        <Link
          href="/"
          className="flex flex-shrink-0 items-start justify-between"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 26 25"
            className="h-8 w-auto"
          >
            <path
              fill="#123c66"
              fillRule="nonzero"
              d="M24.322 0a1 1 0 0 1 1 1v23a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h23.322ZM12.661 6.944 5.627 18.056h14.068L12.66 6.944h.001Z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Fireblocks Tokenization Lab
            </h3>
            {!!assetName && (
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">Network</span> {assetName}
              </p>
            )}
            {!!account && (
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">Account</span>{" "}
                {account?.name || account?.id}
              </p>
            )}
          </div>
        </Link>
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
