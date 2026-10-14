import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
};

const Button = ({ children, onClick, variant = "primary" }: Props) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded font-medium transition",
        {
          "bg-blue-500 text-white hover:bg-blue-600": variant === "primary",
          "bg-gray-200 text-black": variant === "secondary",
          "bg-red-500 text-white hover:bg-red-600": variant === "danger",
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;