import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { burnRequestSchema, BurnRequest, Account } from "~/lib/schemas";
import { useGlobalContext } from "~/context/Global";
import { trpc } from "~/utils/trpc";
import { Form } from "~/components/Form";
import { Input } from "~/components/Input";

const hiddenInputs = [
  "assetId",
  "apiKey",
  "account.address",
  "account.id",
  "contract.address",
  "contract.abi",
] as const;

const Burn = () => {
  const { assetId, apiKey, account, contract, setAccount } = useGlobalContext();

  const burnMutation = trpc.burn.useMutation({
    onSuccess: ({ balances }) => {
      setAccount({
        ...(account as Account),
        balances,
      });
    },
  });

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

  const onSubmit = (formData: BurnRequest) => burnMutation.mutate(formData);

  return (
    <Form
      title="Burn Token"
      description={`Destroy ${contract?.symbol} tokens in your account.`}
      submitLabel="Burn"
      disabled={burnMutation.isLoading}
      onSubmit={handleSubmit(onSubmit)}
    >
      {hiddenInputs.map((key) => (
        <input key={key} type="hidden" {...register(key)} />
      ))}
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
