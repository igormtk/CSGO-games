// Shuffle an array
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Generate a message based on the player's score
export const getGameOverMessage = (score: number, maxPoints: number): string => {
  if (score === maxPoints) {
    return "You're a legend! You are a one man army!";
  }

  const scoreInterval = Math.floor(score / 500); // Divide o score por 500 para criar faixas

  switch (scoreInterval) {
    case 0:
      return "You’re a noob. Time to start aiming properly!";
    case 1:
      return "You’re still trash, but at least you’re trying...";
    case 2:
      return "Getting better, but not yet MVP material.";
    case 3:
      return "You're decent, but still can’t carry a team.";
    case 4:
      return "You’re the last hope of your team... Don’t choke!";
    default:
      return "You're a god... But can you still improve?";
  }
};

