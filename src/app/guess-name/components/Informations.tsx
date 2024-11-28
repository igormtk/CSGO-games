// components/Informations.tsx
interface InformationsProps {
  score: number;
  lives: number;
  record: number | null;
}

const Informations: React.FC<InformationsProps> = ({ score, lives, record }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md mx-auto mt-4">
      <p className="text-xl font-semibold">Score: <span className="font-normal">{score}</span></p>
      <p className="text-xl font-semibold">Lives: <span className="font-normal">{lives}</span></p>
      <p className="text-xl font-semibold">Your Record: <span className="font-normal">{record || '0'}</span></p>
    </div>
  );
};

export default Informations;
