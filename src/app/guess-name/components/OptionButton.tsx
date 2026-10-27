interface OptionButtonProps {
  onClick: () => void;
  label: string;
}

const OptionButton = ({ label, onClick }: OptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cs-cut-sm w-full border-l-4 border-cs-line bg-cs-raised px-4 py-3 text-left text-lg font-bold uppercase tracking-wide transition hover:border-cs-orange hover:bg-cs-line hover:text-cs-orange"
    >
      {label}
    </button>
  );
};

export default OptionButton;
