type Props = {
  placeholder?: string;
  type?: string;
  onChange?: (e: any) => void;
};

const Input = ({ placeholder, type = "text", onChange }: Props) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
};

export default Input;