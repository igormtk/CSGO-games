interface QuestionHeaderProps {
    label: string;
}

const QuestionHeader = ({label}: QuestionHeaderProps) => {
    return (
        <div className="border-b-2 border-cs-orange bg-gradient-to-r from-cs-raised to-cs-surface px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">Qual é o nome real de</p>
            <h1 className="truncate text-4xl font-bold uppercase leading-none tracking-wide">{label}</h1>
        </div>
    );
};

export default QuestionHeader;
