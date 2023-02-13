import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deployRequestSchema, DeployRequest, Account } from "~/lib/schemas";
import { trpc } from "~/utils/trpc";
import { getContract } from "~/lib/contract";
import { useGlobalContext } from "~/context/Global";
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
    apiKey,
    account,
    contract: contractInfo,
    setAccount,
    setContract,
  } = useGlobalContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<DeployRequest>({
    resolver: zodResolver(deployRequestSchema),
    defaultValues: {
      assetId,
      apiKey,
      account,
      name: contractInfo?.name || "MyToken",
      symbol: contractInfo?.symbol || "MTK",
      premint: 1000000,
    },
  });

  const { name, symbol, premint } = watch();

  const deployMutation = trpc.deploy.useMutation({
    onSuccess: ({ abi, contractAddress, balances }) => {
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
  });

  const contract = getContract({ name, symbol, premint });

  const onSubmit = (formData: DeployRequest) => deployMutation.mutate(formData);

  return (
    <Form
      title="Deploy Token"
      description={`Deploy an ERC-20 token contract to the ${
        assetName ? ` ${assetName}` : ""
      } blockchain.`}
      submitLabel="Deploy"
      disabled={deployMutation.isLoading}
      onSubmit={handleSubmit(onSubmit)}
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
          value={contract.solidity}
          readOnly
          className="mt-1 block h-80 w-full rounded-md border border-gray-300 py-2 px-3 font-mono shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </Form>
  );
};

export default Deploy;
