interface CharsLeftProps {
  charsLeft: number;
}

export const CharsLeft: React.FC<CharsLeftProps> = ({ charsLeft }) => {
  return (
    <div
      className={`${charsLeft >= 0 ? "text-zinc-800" : "text-red-500"} text-sm`}
    >
      {`${charsLeft} characters left`}
    </div>
  );
};
