"use client";
import FootballArea from "@/components/FootballArea";
import db from "@/firebase/firestore";
import Game from "@/types/game";
import Player from "@/types/player";
import Team from "@/types/team";
import { collection, getDocs, onSnapshot, query, updateDoc, where } from "@firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function GameComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const gameCode = searchParams.get("code");
    const playerId = searchParams.get("playerId");
    const [game, setGame] = useState<Game>();
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(30);

    useEffect(() => {
        if (!gameCode) {
            router.push("/");
        }

        if (!gameCode) {
            return;
        }

        const q = query(collection(db, "games"), where("code", "==", gameCode));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                router.push("/");
                return;
            }

            const doc = snapshot.docs[0];
            const data = doc.data() as Game;
            setGame(data);
            const allPlayersReady = data.players.every((player) => player.ready);
            if (allPlayersReady && data.players.length > 1) {
                setGameStarted(true);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [gameCode]);

    useEffect(() => {
        if (!gameCode) {
            router.push("/");
        }

        if (!gameCode) {
            return;
        }
    }, [gameCode]);

    const [team, setTeam] = useState<Team>();

    useEffect(() => {
        const fetchTeam = async () => {
            console.log(game);
            const res = await fetch("/api/team?team=" + game?.team.name + "&season=" + game?.season.name);
            const data = await res.json();
            setTeam(data);
        };

        if (game) {
            fetchTeam();
        }
    }, [game]);

    useEffect(() => {
        if (gameStarted) {
            const interval = setInterval(() => {
                setTimer((timer) => timer <= 0 ? 0 : timer - 1);
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [gameStarted]);

    const guessFootballer = async (name: string, position: string) => {
        if (!game) {
            alert("Game not found");
            return;
        }
        if (!gameStarted) {
            alert("The game has not started yet!");
            return;
        }
        if (timer <= 0) {
            alert("Time is up!");
            return;
        }
        const res = await fetch("/api/guess", {
            method: "POST",
            body: JSON.stringify({
                name,
                team: game.team,
                season: game.season,
                position
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        if (data.correct) {
            const q = query(collection(db, "games"), where("code", "==", gameCode));
            const docs = await getDocs(q);
            for (const doc of docs.docs) {
                const data = doc.data();
                const players = data.players as Player[];
                const player = players.find((player) => player.id === playerId);
                if (player) {
                    player.score += 1;
                    player.ready = true;
                }
                if (!data.footballers) {
                    data.footballers = [];
                }
                data.footballers.push({ name, position, isGuessed: true, guessedBy: playerId, guessedAt: new Date() });

                await updateDoc(doc.ref, { players, footballers: data.footballers });
            }
        } else {
            alert("Wrong!");
        }
    }

    const startGame = async () => {
        const q = query(collection(db, "games"), where("code", "==", gameCode));
        const docs = await getDocs(q);
        for (const doc of docs.docs) {
            const data = doc.data();
            const players = data.players as Player[];
            const player = players.find((player) => player.id === playerId);
            if (player) {
                player.ready = true;
            }
            await updateDoc(doc.ref, { players });
        }
    }

    const nextGuess = async () => {
        const q = query(collection(db, "games"), where("code", "==", gameCode));
        const docs = await getDocs(q);
        for (const doc of docs.docs) {
            const data = doc.data();
            const players = data.players as Player[];
            const player = players.find((player) => player.id === playerId);
            if (player) {
                player.ready = false;
            }
            await updateDoc(doc.ref, { players });
        }
        setTimer(30);
    }

    return (
        <div>
            <div className="min-h-screen flex justify-center items-center bg-green-900 text-white">
                {team && <FootballArea team={team} gameStarted={gameStarted} guessFootballer={guessFootballer} />}
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-green-800 flex justify-between items-center">
                <p className="text-white">Code: {gameCode}</p>
                {game && game.players.find((player) => player.id === playerId)?.ready ? (
                    <p className="text-white">{gameStarted ? (timer > 0 ? timer : <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={nextGuess}
                    >
                        Next Guess
                    </button>) : "Waiting for other players to start the game"}</p>
                ) : (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={startGame}
                    >
                        Start Game
                    </button>
                )}
            </div>
        </div>
    )
}

export default function GamePage() {
    <Suspense>
        <GameComponent />
    </Suspense>
}