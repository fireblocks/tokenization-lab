import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { burnRequestSchema, BurnRequest } from "~/lib/schemas";
import { useGlobalContext } from "~/context/Global";
import { trpc } from "~/utils/trpc";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";

const Burn = () => {
  const burnMutation = trpc.burn.useMutation();

  const { assetId, apiKey, account, contract } = useGlobalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BurnRequest>({
    resolver: zodResolver(burnRequestSchema),
    defaultValues: {
      assetId,
      apiKey,
      account,
      contract,
      amount: 1000000,
    },
  });

  const onSubmit = async (formData: BurnRequest) => {
    try {
      const hash = await burnMutation.mutateAsync(formData);

      console.info("Tx hash:", hash);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      title="Burn Token"
      description={`Destroy ${contract?.symbol} tokens in your account.`}
      submitLabel="Burn"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input type="hidden" {...register("assetId")} />
      <input type="hidden" {...register("apiKey")} />
      <input type="hidden" {...register("account.address")} />
      <input type="hidden" {...register("account.id")} />
      <input type="hidden" {...register("contract.address")} />
      <input type="hidden" {...register("contract.abi")} />
      <Input
        className="col-span-2"
        label="Amount"
        error={errors.amount?.message}
        inputProps={{
          ...register("amount", {
            setValueAs: (v: any): number => Number(v) || 0,
          }),
          type: "number",
          placeholder: "1000000",
          min: 0,
          max: Number.MAX_VALUE,
        }}
      />
    </Form>
  );
};

export default Burn;
