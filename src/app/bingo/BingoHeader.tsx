"use client";
import React, { useState, useEffect } from "react";
import { players } from "@/data/playersMock";
import { Button } from "../../components/ui/button";

const BingoHeader: React.FC = () => {
    const [help, setHelp] = useState<number>(1);
    const [randomPlayerNickName, setRandomPlayerNickName] = useState<string>("");
    const [randomPlayerFirstName, setRandomPlayerFirstName] = useState<string>("");
    const [randomPlayerLastName, setRandomPlayerLastName] = useState<string>("");

    useEffect(() => {
        generateRandomPlayer();
    }, []);

    const generateRandomPlayer = () => {
        const randomIndex = Math.floor(Math.random() * players.length);
        const randomPlayer = players[randomIndex];

        setRandomPlayerNickName(randomPlayer.matchName || "");
        setRandomPlayerFirstName(randomPlayer.firstName || "");
        setRandomPlayerLastName(randomPlayer.lastName || "");
    };

    const toggleHelp = () => {
        setHelp((prevHelp) => prevHelp - 1);
        generateRandomPlayer();
    };

    return (
        <div className="text-center m-12">
            <p className="text-xl font-bold mb-2">{randomPlayerNickName}</p>
            <p className="text-md mb-4">
                Name: {randomPlayerLastName}, {randomPlayerFirstName}
            </p>
            <div className="flex justify-center space-x-4">
                <Button onClick={generateRandomPlayer}>Skip</Button>
                <Button onClick={toggleHelp} disabled={help === 0}>Help ({help})</Button>
            </div>
        </div>
    );
};

export default BingoHeader;
