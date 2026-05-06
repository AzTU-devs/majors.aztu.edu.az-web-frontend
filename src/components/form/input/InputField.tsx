import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  className?: string;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      id,
      name,
      placeholder,
      value,
      onChange,
      onKeyDown,
      onBlur,
      className = "",
      min,
      max,
      step,
      disabled = false,
      success = false,
      error = false,
      hint,
      required,
      ...rest
    },
    ref
  ) => {
    let inputClasses = `h-11 w-full appearance-none rounded-xl border bg-white/80 px-4 py-2.5 text-sm shadow-soft transition duration-200 ease-out placeholder:text-gray-400 focus:outline-none focus:shadow-focus-ring dark:bg-gray-900/70 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

    if (disabled) {
      inputClasses += ` cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500 opacity-60 dark:border-white/5 dark:bg-gray-800 dark:text-gray-400`;
    } else if (error) {
      inputClasses += ` border-error-400 focus:border-error-500 dark:border-error-500/70 dark:text-error-300`;
    } else if (success) {
      inputClasses += ` border-success-400 focus:border-success-500 dark:border-success-500/70 dark:text-success-300`;
    } else {
      inputClasses += ` border-gray-200/80 text-gray-900 hover:border-gray-300 focus:border-brand-400 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-brand-400`;
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...rest}
        />
        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

export default Input;