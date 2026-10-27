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
    <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
      <div className="cs-cut bg-cs-surface">
        <QuestionHeader label={matchName} />
        <div className="space-y-2 p-3">
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
      </div>
    </div>
  );
};

export default QuestionSection;
