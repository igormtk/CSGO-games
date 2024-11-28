import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { resetGame, finishGame, openModal } from "@/redux/slices/guessName";
import { getGameOverMessage } from "@/utils/utils";

const AlertModal = () => {
  const dispatch = useAppDispatch(); // Getting the dispatch function from Redux
  const { players, score, modal } = useAppSelector((state) => state.game); // Accessing game data from Redux store

  // Function to handle closing the modal and resetting the game
  const handleClose = () => {
    dispatch(resetGame()); // Resetting the game state
    dispatch(finishGame()); // Marking the game as finished
    dispatch(openModal(false)); // Closing the modal
  };

  // Getting the game over message based on the score and the number of players
  const message = getGameOverMessage(score, players.length);

  return (
      <AlertDialog open={modal} onOpenChange={handleClose}> 
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Game Over</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Try again</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
