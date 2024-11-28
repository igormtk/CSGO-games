import OptionButton from "./OptionButton";
import QuestionHeader from "./QuestionHeader";

interface QuestionSectionProps {
  question: {
    correctPlayer: { CommonName: string };
    alternatives: string[];
    matchName: string;
  };
  handleAnswer: (answer: string, correctAnswer: string) => void;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ question, handleAnswer }) => {
  const { alternatives, correctPlayer, matchName } = question;

  const handleOptionClick = (name: string) => {
    handleAnswer(name, correctPlayer.CommonName);
  };

  return (
    <div className="flex flex-col items-center">
      <QuestionHeader label={matchName} />
      {alternatives.map((name, index) => {
        return (
          <OptionButton
            key={index}
            onClick={() => handleOptionClick(name)}
            label={name}
          />
        );
      })}
    </div>
  );
};

export default QuestionSection;
