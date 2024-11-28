import { Badge } from "@/components/ui/badge";

interface QuestionHeaderProps {
    label: string;
}

const QuestionHeader = ({label}: QuestionHeaderProps) => {
    return (
        <div className="text-center m-12">
           What is <Badge>{label}</Badge> is real name?
        </div>
    );
};

export default QuestionHeader;
