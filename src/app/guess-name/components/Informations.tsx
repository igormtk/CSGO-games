// components/Informations.tsx
interface InformationsProps {
  score: number;
  lives: number;
  record: number | null;
}

const Informations: React.FC<InformationsProps> = ({ score, lives, record }) => {
  const items = [
    { label: "Pontos", value: score, color: "text-cs-green" },
    { label: "Vidas", value: lives, color: "text-cs-red" },
    { label: "Recorde", value: record || 0, color: "text-cs-orange" },
  ];

  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {items.map((item) => (
        <div key={item.label} className="cs-cut-sm bg-cs-surface p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{item.label}</p>
          <p className={`mt-0.5 text-3xl font-bold leading-none ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Informations;
