import React from "react";

interface Team {
  teamId: number;
  areaId: number;
  areaName: string;
  key: string;
  name: string;
  shortName: string;
  active: boolean;
  gender: string;
  type: string;
  website: string | null;
  email: string | null;
  founded: number | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  tertiaryColor: string | null;
  quaternaryColor: string | null;
  facebook: string | null;
  twitter: string | null;
  youTube: string | null;
  instagram: string | null;
}

interface BingoCardProps {
  items: Team[];
}

const BingoCard: React.FC<BingoCardProps> = ({ items }) => {
  // Ensure we have at least 9 items, otherwise fill the rest with empty objects
  const filledItems = items.concat(
    Array.from({ length: Math.max(0, 9 - items.length) }, () => ({} as Team))
  );

  // Função para selecionar um time aleatório
  const getRandomTeam = (): Team => {
    const randomIndex = Math.floor(Math.random() * filledItems.length);
    return filledItems[randomIndex];
  };

  return (
    <div className="table-container">
      <table className="table-auto">
        <tbody>
          {[0, 1, 2].map((row) => (
            <tr key={row} className="cursor-pointer">
              {[0, 1, 2].map((col) => {
                const randomTeam = getRandomTeam();
                return (
                  <td key={col} className="bingo-cell border text-center p-10 w-24 h-24">
                    {randomTeam.name && (
                      <>
                        <p className="font-semibold">{randomTeam.name}</p>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BingoCard;
