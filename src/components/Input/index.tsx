import { HTMLAttributes, InputHTMLAttributes, useId } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

type Props = HTMLAttributes<HTMLDivElement> & {
  label: string;
  error?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export const Input = ({ label, error, inputProps, ...props }: Props) => {
  const inputId = useId();
  const errorId = useId();

  const hasError = !!error;

  return (
    <div {...props}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <input
            {...inputProps}
            id={inputId}
            className={clsx(
              "block w-full rounded-md border px-3 py-2 focus:outline-none sm:text-sm",
              hasError
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
              inputProps?.className,
            )}
            autoComplete="off"
            autoCorrect="off"
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
          />
          {hasError && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};
