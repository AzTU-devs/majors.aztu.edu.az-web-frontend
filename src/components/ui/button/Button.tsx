import { ReactNode } from "react";

type Variant = "primary" | "outline" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2.5 text-sm rounded-xl",
  md: "px-5 py-3 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "brand-gradient text-white shadow-glow hover:brightness-110 hover:shadow-elevated disabled:opacity-50 disabled:hover:brightness-100",
  secondary:
    "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-200 dark:hover:bg-brand-500/20",
  outline:
    "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 hover:ring-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:ring-white/20",
  ghost:
    "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/5",
  destructive:
    "bg-error-500 text-white shadow-soft hover:bg-error-600 disabled:opacity-50",
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`group inline-flex items-center justify-center gap-2 font-medium transition duration-200 ease-out focus-ring active:scale-[0.98] ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-60 active:scale-100" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
