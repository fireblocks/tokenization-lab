import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deployRequestSchema, DeployRequest } from "~/lib/schemas";
import { trpc } from "~/utils/trpc";
import { getAssetName } from "~/lib/assets";
import { getContract } from "~/lib/contract";
import { useGlobalContext } from "~/context/Global";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";

const Deploy = () => {
  const {
    assetId,
    apiKey,
    account,
    contract: contractInfo,
    setContract,
  } = useGlobalContext();

  const assetName = getAssetName(assetId);

  const deployMutation = trpc.deploy.useMutation({
    // variables: {},
    // onMutate,
    // onSuccess,
    // onError,
  });

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

  const contract = getContract({ name, symbol, premint });

  const onSubmit = async (formData: DeployRequest) => {
    try {
      const { abi, contractAddress } = await deployMutation.mutateAsync(
        formData
      );

      setContract({
        name: formData.name,
        symbol: formData.symbol,
        abi: abi as any[],
        address: contractAddress as string,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      title="Deploy Token"
      description={`Deploy an ERC-20 token contract to the ${assetName} blockchain.`}
      submitLabel="Deploy"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input type="hidden" {...register("assetId")} />
      <input type="hidden" {...register("apiKey")} />
      <input type="hidden" {...register("account.address")} />
      <input type="hidden" {...register("account.id")} />
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
          max: Number.MAX_VALUE,
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
