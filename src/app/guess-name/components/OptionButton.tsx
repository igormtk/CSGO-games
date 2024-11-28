import { Button } from "@/components/ui/button";

interface OptionButtonProps {
  onClick: () => void;
  label: string;
}

const OptionButton = ({ label, onClick }: OptionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`min-w-[300px] m-2`}
    >
      {label}
    </Button>
  );
};

export default OptionButton;
