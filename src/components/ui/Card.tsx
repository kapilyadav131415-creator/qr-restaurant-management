const Card = ({ children }: any) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      {children}
    </div>
  );
};

export default Card;