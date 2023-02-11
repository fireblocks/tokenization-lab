import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mintRequestSchema, MintRequest, Account } from "~/lib/schemas";
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

const Mint = () => {
  const { assetId, apiKey, account, contract, setAccount } = useGlobalContext();

  const mintMutation = trpc.mint.useMutation({
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
  } = useForm<MintRequest>({
    resolver: zodResolver(mintRequestSchema),
    defaultValues: {
      assetId,
      apiKey,
      account,
      contract,
      amount: 1000000,
    },
  });

  const onSubmit = (formData: MintRequest) => mintMutation.mutate(formData);

  return (
    <Form
      title="Mint Token"
      description={`Issue new ${contract?.symbol} tokens to your account.`}
      submitLabel="Mint"
      disabled={mintMutation.isLoading}
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

export default Mint;
