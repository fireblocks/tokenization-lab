import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { getContract } from "~/lib/contract";
import { Account, DeployRequest, deployRequestSchema } from "~/lib/schemas";
import { trpc } from "~/lib/trpc";
import { useGlobalContext } from "~/context/Global";
import { useNotification } from "~/context/Notification";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";

const hiddenInputs = [
  "assetId",
  "apiKey",
  "account.address",
  "account.id",
] as const;

const Deploy = () => {
  const {
    assetId,
    assetName,
    assetExplorer,
    apiKey,
    account,
    contract,
    setAccount,
    setContract,
  } = useGlobalContext();

  const { onOpen: onOpenNotification } = useNotification();

  const defaultValues = {
    assetId,
    apiKey,
    account,
    name: contract?.name || "MyToken",
    symbol: contract?.symbol || "MTK",
    premint: 1000000,
  };

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<DeployRequest>({
    resolver: zodResolver(deployRequestSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isDirty && assetId && apiKey && account) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, assetId, apiKey, account]);

  const { name, symbol, premint } = watch();

  const solidity = getContract({ name, symbol, premint });

  const deployMutation = trpc.deploy.useMutation({
    onMutate: ({ name }) =>
      onOpenNotification({
        title: `Deploying token "${name}"`,
        description: `On ${assetName}`,
        type: "loading",
      }),
    onSuccess: ({ abi, contractAddress, balances }, { name, symbol }) => {
      onOpenNotification({
        title: `Deployed token "${name}"`,
        description: `On ${assetName}${
          balances.token
            ? `. Balance: ${balances.token.toFixed(4)} ${symbol}`
            : ``
        }`,
        type: "success",
        actions: [
          {
            key: "explorer",
            primary: true,
            children: "Open Explorer",
            href: `https://${assetExplorer}/token/${contractAddress}`,
            target: "_blank",
            rel: "noopener noreferrer",
            isLink: true,
          },
        ],
      });

      setAccount({
        ...(account as Account),
        balances,
      });

      setContract({
        name,
        symbol,
        abi: abi as any[],
        address: contractAddress as string,
      });
    },
    onError: (error) =>
      onOpenNotification({
        title: `Failed to deploy token "${name}"`,
        description: error.message,
        type: "error",
      }),
  });

  const onSubmit = (formData: DeployRequest) => deployMutation.mutate(formData);

  return (
    <Form
      title="Deploy Token"
      description={`Deploy an ERC-20 token contract to the ${
        assetName ? ` ${assetName}` : ""
      } blockchain.`}
      submitLabel="Deploy"
      disabled={deployMutation.isLoading}
      onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}
    >
      {hiddenInputs.map((key) => (
        <input key={key} type="hidden" {...register(key)} />
      ))}
      <Input
        className="col-span-4"
        label="Name"
        error={errors.name?.message}
        inputProps={{
          ...register("name"),
          type: "text",
          placeholder: "My Token",
        }}
      />
      <Input
        className="col-span-2"
        label="Symbol"
        error={errors.symbol?.message}
        inputProps={{
          ...register("symbol"),
          type: "text",
          placeholder: "MTK",
        }}
      />
      <Input
        className="col-span-2"
        label="Premint"
        error={errors.premint?.message}
        inputProps={{
          ...register("premint", {
            setValueAs: (v: any): number => Number(v) || 0,
          }),
          type: "number",
          placeholder: "1000000",
          min: 0,
          max: 2 ** 53,
        }}
      />
      <div className="col-span-6">
        <label
          htmlFor="contract"
          className="block text-sm font-medium text-gray-700"
        >
          Contract
        </label>
        <textarea
          name="contract"
          id="contract"
          value={solidity}
          readOnly
          className="mt-1 block h-80 w-full rounded-md border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </Form>
  );
};

export default Deploy;
