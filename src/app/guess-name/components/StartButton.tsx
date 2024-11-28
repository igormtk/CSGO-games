// components/StartButton.tsx
import { Button } from "@/components/ui/button";

interface StartButtonProps {
  onClick: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick }) => {
  return <Button onClick={onClick} variant="default">Start Game</Button>;
};

export default StartButton;
