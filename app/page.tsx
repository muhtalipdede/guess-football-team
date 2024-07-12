"use client";
import db from "@/firebase/firestore";
import Player from "@/types/player";
import { generateGuid } from "@/utils/guid";
import { addDoc, collection, getDocs, query, updateDoc, where } from "@firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState<string>("");

  const createGame = async () => {
    router.push("/select-team-and-session");
  };

  const joinGame = async () => {
    const q = query(collection(db, "games"), where("code", "==", gameCode));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      alert("Game not found");
      return;
    }
    snapshot.forEach((doc) => {
      const data = doc.data();
      const players = data.players as Player[];
      if (players.length >= 2) {
        alert("Game is full");
        return;
      }
      const player = {
        id: generateGuid(),
        name: `Player ${players.length + 1}`,
        score: 0,
        color: "blue",
      } as Player;
      players.push(player);
      updateDoc(doc.ref, { players });
      router.push(`/game?code=${gameCode}&playerId=${player.id}&gameId=${doc.id}`);
    });
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-green-900 text-white">
      <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h1 className="text-xl font-bold">Football Guess Game</h1>
      <p className="text-center">Create a game or join an existing game</p>
      <button
        onClick={createGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Create Game
      </button>
      <p className="text-center">OR</p>
      <p className="text-center">Enter Game Code</p>
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Enter Game Code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          className="border border-gray-300 p-2 rounded text-black"
        />
        <button
          onClick={joinGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Join Game
        </button>
      </div>
      </div>
    </main>
  );
}
