"use client";
import db from "@/firebase/firestore";
import Player from "@/types/player";
import Season from "@/types/season";
import Team from "@/types/team";
import { generateGuid } from "@/utils/guid";
import { addDoc, collection } from "@firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SelectTeamAndSession() {
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team>();

    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<Season>();

    useEffect(() => {
        const fetchTeams = async () => {
            const teamsData = await fetch("/api/teams");
            const teams = await teamsData.json();
            setTeams(teams);
        };
        const fetchSeasons = async () => {
            const seasonsData = await fetch("/api/seasons");
            const seasons = await seasonsData.json();
            setSeasons(seasons);
        }
        fetchSeasons();
        fetchTeams();
    }, []);

    const createGame = async () => {
        const gameCode = Math.random().toString(36).substring(7);
        const player = {
            id: generateGuid(),
            name: "Player 1",
            score: 0,
            color: "red",
        } as Player;
        const gameDoc = await addDoc(collection(db, "games"), {
            code: gameCode,
            players: [player],
            team: selectedTeam,
            season: selectedSeason,
        });
        router.push(`/game?code=${gameCode}&playerId=${player.id}&gameId=${gameDoc.id}`);
    };
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
            <h1 className="text-xl font-bold">Select Team</h1>
            <p className="text-center">Select a team to play with</p>
            <select
                onChange={(e) => {
                    const team = teams.find((team) => team.name === e.target.value);
                    setSelectedTeam(team);
                }}
                className="p-2 border border-gray-300 rounded"
            >
                <option>Select Team</option>
                {teams.map((team) => (
                    <option key={team.name}>{team.name}</option>
                ))}
            </select>
            <h1 className="text-xl font-bold">Select Season</h1>
            <p className="text-center">Select a season to play in</p>
            <select
                onChange={(e) => {
                    const season = seasons.find((season) => season.name === e.target.value);
                    setSelectedSeason(season);
                }}
                className="p-2 border border-gray-300 rounded"
            >
                <option>Select Season</option>
                {seasons.map((season) => (
                    <option key={season.name}>{season.name}</option>
                ))}
            </select>
            <button
                onClick={createGame}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Start Game
            </button>
        </div>
    );
}