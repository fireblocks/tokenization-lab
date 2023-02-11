import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authRequestSchema, AuthRequest } from "~/lib/schemas";
import { trpc } from "~/utils/trpc";
import { useGlobalContext } from "~/context/Global";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { AssetId, assets, getAssetName } from "~/lib/assets";

const Index = () => {
  const router = useRouter();

  const {
    assetId,
    apiKey: defaultApiKey,
    account,
    setAssetId,
    setApiKey,
    setAccount,
  } = useGlobalContext();

  const [tmpAccountId, setTmpAccountId] = useState<number | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<AuthRequest>({
    resolver: zodResolver(authRequestSchema),
    defaultValues: { apiKey: defaultApiKey || "" },
  });

  const apiKey = watch("apiKey");

  const assetsQuery = trpc.assets.useQuery(
    { apiKey },
    {
      enabled: isSubmitSuccessful && !errors.apiKey,
      onSuccess: (_assets) => setAssetId(_assets[0].id as AssetId),
    }
  );

  const assetOptions = useMemo(() => {
    if (!assetsQuery.data) {
      return [];
    }

    return assetsQuery.data
      .filter((asset) =>
        assets.some((a) => a.id === asset.id && !!parseFloat(asset.total))
      )
      .map((asset) => {
        const name = getAssetName(asset.id as AssetId);

        const balance = parseFloat(asset.total).toFixed(4);

        return {
          value: asset.id,
          label: `${name} | Balance: ${balance}`,
        };
      });
  }, [assetsQuery.data]);

  const accountsForAssetQuery = trpc.accountsForAsset.useQuery(
    { apiKey, assetId },
    {
      enabled: !!assetOptions.length,
      onSuccess: (_accounts) => setTmpAccountId(parseInt(_accounts[0].id)),
    }
  );

  const accountsForAsset = accountsForAssetQuery.data;

  const accountsForAssetOptions = useMemo(() => {
    if (!accountsForAsset) {
      return [];
    }

    return accountsForAsset.map((account) => {
      const balanceStr = account.assets?.find((a) => a.id === assetId)?.total;

      const balance = balanceStr ? parseFloat(balanceStr).toFixed(4) : 0;

      return {
        value: account.id,
        label: `${account.name} | Balance: ${balance}`,
      };
    });
  }, [assetId, accountsForAsset]);

  const addressQuery = trpc.address.useQuery(
    { apiKey, assetId, accountId: tmpAccountId as number },
    {
      enabled: !!accountsForAssetOptions.length,
      onSuccess: (address) => {
        const selectedAsset = assetsQuery.data?.find((a) => a.id === assetId);

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
          balances: {
            baseAsset: parseFloat(selectedAsset.total),
            token: 0,
          },
        };

        setAccount(_account);
      },
    }
  );

  const onSubmit = async (formData: AuthRequest) => setApiKey(formData.apiKey);

  return (
    <>
      <Form
        title="Fireblocks API"
        description="Configure access to Fireblocks with an API user."
        submitLabel="Log In"
        onSubmit={handleSubmit(onSubmit)}
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
          disabled={!assetOptions.length}
        >
          <Select
            className="col-span-6"
            label="Network"
            options={assetOptions}
            inputProps={{
              value: assetId || "ETH_TEST3",
              onChange: (e) => setAssetId(e.target.value as AssetId),
            }}
          />
        </Form>
        <Form
          title="Vault Account"
          description="Choose a vault account."
          disabled={!accountsForAssetOptions.length}
        >
          <Select
            className="col-span-6"
            label="Vault Account"
            options={accountsForAssetOptions}
            inputProps={{
              value: (tmpAccountId || account?.id || "0").toString(),
              onChange: (e) => setTmpAccountId(parseInt(e.target.value)),
            }}
          />
        </Form>
      </div>
    </>
  );
};

export default Index;
