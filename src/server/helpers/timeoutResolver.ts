import { MaybePromise, ProcedureBuilder, ProcedureParams } from "@trpc/server";
import { DefaultValue } from "@trpc/server/src/core/internals/utils";

const TIMEOUT = 59000; // ms

const timeout = () =>
  new Promise<never>((resolve, reject) => {
    let timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);

      reject(`Timed out in ${TIMEOUT / 1000} seconds`);
    }, TIMEOUT);
  });

/**
 * Generic resolver wrapper that forwards the resolver input and times out after TIMEOUT milliseconds.
 *
 * @param resolver tRPC resolver function
 * @returns wrapped resolver function
 */
export const timeoutResolver =
  <
    TParams extends ProcedureParams,
    Procedure extends Parameters<ProcedureBuilder<TParams>["query"]>[0],
    Opts extends Parameters<Procedure>[0],
    $Output,
  >(
    resolver: (
      input: Opts["input"],
    ) => MaybePromise<DefaultValue<TParams["_output_in"], $Output>>,
  ) =>
  async (opts: Opts) =>
    Promise.race([resolver(opts.input), timeout()]);
