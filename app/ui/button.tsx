import clsx from "clsx";

const colorClasses = {
  blue: "bg-blue-500 hover:bg-blue-400 focus-visible:outline-blue-500 active:bg-blue-600",
  red: "bg-red-500 hover:bg-red-400 focus-visible:outline-red-500 active:bg-red-600",
  green:
    "bg-green-500 hover:bg-green-400 focus-visible:outline-green-500 active:bg-green-600",
  // etc.
} satisfies Record<string, string>;

type ButtonColor = keyof typeof colorClasses;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: ButtonColor;
}
export function Button({ children, className, color, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        colorClasses[color || "blue"],
        className,
      )}
    >
      {children}
    </button>
  );
}
