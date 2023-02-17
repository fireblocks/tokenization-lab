import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { clsx } from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircleIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { authRequestSchema, AuthRequest } from "~/lib/schemas";
import { trpc } from "~/utils/trpc";
import { useGlobalContext } from "~/context/Global";
import { useNotification } from "~/context/Notification";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { AssetId, defaultAsset, getAsset } from "~/lib/assets";
import { getApiPrivateKey } from "~/server/helpers/apiPrivateKey";

type Props = {
  hasApiPrivateKey: boolean;
};

const Index = ({ hasApiPrivateKey }: Props) => {
  const {
    assetId,
    assetName,
    apiKey: defaultApiKey,
    account,
    setAssetId,
    setApiKey,
    setAccount,
    setContract,
    resetContext,
  } = useGlobalContext();

  const { onOpen: onOpenNotification, onClose: onCloseNotification } =
    useNotification();

  const [tmpApiKey, setTmpApiKey] = useState(defaultApiKey || null);
  const [tmpAccountId, setTmpAccountId] = useState<number | null>(null);

  const apiKey = tmpApiKey || defaultApiKey || "";

  const resetWalletData = () => {
    setTmpAccountId(null);
    setAccount(null);
    setContract(null);
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AuthRequest>({
    resolver: zodResolver(authRequestSchema),
    defaultValues: { apiKey },
  });

  const assetsMutation = trpc.assets.useMutation({
    onSuccess: (_assets, vars) => {
      const hasDefaultAsset = _assets.some((a) => a.id === defaultAsset.id);

      const _assetId = hasDefaultAsset ? defaultAsset.id : _assets[0].id;

      setAssetId(_assetId as AssetId);

      setApiKey(vars.apiKey);

      onCloseNotification();
    },
    onError: (error) => {
      resetWalletData();

      onOpenNotification({
        title: `Failed to log in to Fireblocks`,
        description: error.message,
        icon: XCircleIcon,
      });
    },
  });

  const assetOptions = useMemo(() => {
    if (!assetsMutation.data) {
      return [];
    }

    return assetsMutation.data.map((asset) => {
      const name = getAsset(asset.id)?.name ?? asset.id;

      const balance = parseFloat(asset.total).toFixed(4);

      return {
        value: asset.id,
        label: `${name} · Balance: ${balance}`,
      };
    });
  }, [assetsMutation.data]);

  const accountsForAssetQuery = trpc.accountsForAsset.useQuery(
    { apiKey, assetId: assetId as AssetId },
    {
      enabled:
        !!assetId &&
        !!apiKey &&
        !!assetId &&
        !!assetOptions.length &&
        !assetsMutation.isError &&
        !assetsMutation.isLoading,
      onSuccess: (_accounts) => {
        setTmpAccountId(parseInt(_accounts[0].id));

        onCloseNotification();
      },
      onError: (error) => {
        resetWalletData();

        onOpenNotification({
          title: `Failed to get vault accounts`,
          description: error.message,
          icon: XCircleIcon,
        });
      },
    }
  );

  const accountsForAsset = accountsForAssetQuery.data;

  const accountOptions = useMemo(() => {
    if (!accountsForAsset) {
      return [];
    }

    return accountsForAsset.map((account) => {
      const balanceStr = account.assets?.find((a) => a.id === assetId)?.total;

      const balance = balanceStr ? parseFloat(balanceStr).toFixed(4) : 0;

      return {
        value: account.id,
        label: `${account.name} · Balance: ${balance}`,
      };
    });
  }, [assetId, accountsForAsset]);

  const addressQuery = trpc.getPermanentAddress.useQuery(
    { apiKey, assetId: assetId as AssetId, accountId: tmpAccountId as number },
    {
      enabled:
        !!apiKey &&
        !!tmpAccountId &&
        !!accountOptions.length &&
        !assetsMutation.isError &&
        !assetsMutation.isLoading &&
        !accountsForAssetQuery.isError &&
        !accountsForAssetQuery.isLoading,
      onSuccess: (address) => {
        const selectedAsset = assetsMutation.data?.find(
          (a) => a.id === assetId
        );

        const selectedAccount = accountsForAsset?.find(
          (a) => parseInt(a.id) === tmpAccountId
        );

        if (!selectedAsset || !selectedAccount) {
          return;
        }

        const _account = {
          id: tmpAccountId as number,
          name: selectedAccount.name,
          address: address,
          balances: null,
        };

        setAccount(_account);

        onCloseNotification();
      },
      onError: (error) => {
        resetWalletData();

        onOpenNotification({
          title: `Failed to get vault account deposit address`,
          description: error.message,
          icon: XCircleIcon,
        });
      },
    }
  );

  const onSubmitApiKey = (formData: AuthRequest) => {
    setTmpApiKey(formData.apiKey);
    resetWalletData();
    assetsMutation.mutate(formData);
  };

  useEffect(() => {
    if (!isDirty && defaultApiKey) {
      reset({ apiKey: defaultApiKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, defaultApiKey]);

  useEffect(() => {
    if (defaultApiKey) {
      assetsMutation.mutate({ apiKey: defaultApiKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultApiKey]);

  if (!hasApiPrivateKey) {
    return (
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="h-full space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Fireblocks API Setup
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              An API private key is missing on the server. Place your API
              private key within the repository at <code>keys/api.key</code>, or
              set the <code>PRIVATE_KEY_B64</code> environment variable to a
              base64 encoding of your API private key. Then refresh this page to
              continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form
        title="Fireblocks API"
        description="Configure access to Fireblocks with an API user."
        submitLabel="Log In"
        disabled={assetsMutation.isLoading}
        onSubmit={handleSubmit(onSubmitApiKey)}
        actions={
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-red-300 bg-white py-2 px-4 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => {
              reset({ apiKey: "" });
              resetContext();
            }}
          >
            Reset
          </button>
        }
      >
        <Input
          className="col-span-6"
          label="API Key"
          error={errors.apiKey?.message}
          inputProps={{
            ...register("apiKey"),
            type: "text",
            placeholder: "00000000-0000-0000-0000-000000000000",
            className: "font-mono",
          }}
        />
      </Form>
      <div className="grid grid-cols-2 gap-6">
        <Form
          title="EVM Network"
          description="Choose a blockchain."
          disabled={accountsForAssetQuery.isLoading}
        >
          <Select
            className="col-span-6"
            label="Network"
            options={assetOptions}
            inputProps={{
              value: assetId ?? "",
              onChange: (e) => {
                const _assetId = e.target.value as AssetId;

                if (typeof _assetId === "string") {
                  setAssetId(_assetId);

                  if (assetId !== _assetId) {
                    resetWalletData();
                  }
                }
              },
            }}
          />
        </Form>
        <Form
          title="Vault Account"
          description={`Choose a vault account with ${assetName}.`}
          disabled={addressQuery.isLoading}
        >
          <Select
            className="col-span-6"
            label="Vault Account"
            options={accountOptions}
            inputProps={{
              value: ((tmpAccountId || account?.id) ?? "").toString(),
              onChange: (e) => {
                const _accountId = parseInt(e.target.value);

                if (typeof _accountId === "number") {
                  setTmpAccountId(_accountId);

                  if (account?.id !== _accountId) {
                    setContract(null);
                  }
                }
              },
            }}
          />
        </Form>
      </div>
      <div className="flex justify-center py-3">
        <Link
          href="/deploy"
          className={clsx(
            "text-md inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-3 px-5 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            (assetsMutation.isLoading ||
              accountsForAssetQuery.isLoading ||
              addressQuery.isLoading) &&
              "pointer-events-none opacity-50"
          )}
        >
          <RocketLaunchIcon
            className={"-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-white"}
            aria-hidden="true"
          />{" "}
          Deploy a Token
        </Link>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    await getApiPrivateKey();

    return {
      props: {
        hasApiPrivateKey: true,
      },
    };
  } catch {
    return {
      props: {
        hasApiPrivateKey: false,
      },
    };
  }
};

export default Index;
