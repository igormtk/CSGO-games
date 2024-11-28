import { useState, useEffect, useCallback } from "react";

export const useGameRecord = (score: number) => {
  // State to store the highest score (record)
  const [record, setRecord] = useState<number>(0);

  useEffect(() => {
    // Retrieve the saved record from localStorage
    const localStorageRecord = window.localStorage.getItem("record");
    // If no record exists in localStorage, set it to 0 and save it
    if (!localStorageRecord) {
      window.localStorage.setItem("record", "0");
      setRecord(0);
    } else {
      // Set the state with the value retrieved from localStorage
      setRecord(Number(localStorageRecord));
    }
  }, []);

  // Function to update the record if the current score is higher than the stored record
  const createRecord = useCallback(() => {
    const currentRecord = window.localStorage.getItem("record");
    // If the current score is higher than the saved record, update localStorage and state
    if (score > Number(currentRecord)) {
      window.localStorage.setItem("record", score.toString());
      setRecord(score);
    }
  }, [score]);

  return { record, createRecord };
};
