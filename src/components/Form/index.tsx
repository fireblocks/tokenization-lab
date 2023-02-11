import { FormHTMLAttributes } from "react";
import { clsx } from "clsx";

type Props = FormHTMLAttributes<HTMLFormElement> & {
  title: string;
  description: string;
  submitLabel?: string;
  disabled?: boolean;
};

export const Form = ({
  children,
  className,
  title,
  description,
  submitLabel = "Submit",
  disabled,
  onSubmit,
  ...props
}: Props) => {
  return (
    <form
      {...props}
      onSubmit={onSubmit}
      className={clsx(
        "shadow sm:overflow-hidden sm:rounded-md",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <div className="h-full space-y-6 bg-white py-6 px-4 sm:p-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="grid grid-cols-6 gap-6">{children}</div>
      </div>
      {!!onSubmit && (
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
};
