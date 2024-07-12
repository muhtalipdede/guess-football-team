import Team from "@/types/team";
import FootballerCard from "./FootballerCard";

export default function FootballArea({ team, gameStarted, guessFootballer }: { team: Team, gameStarted: boolean, guessFootballer: (name: string, position: string) => void }) {
    const { defenders, forwards, goalkeeper, midfielders } = team;
    return <div className="flex flex-col w-full max-w-3xl p-4 gap-4">
        <div className="flex justify-center flex-col items-center">
            <h1 className="text-2xl font-bold text-center">{team.name}</h1>
            <h2 className="text-lg font-semibold text-center">{team.season}</h2>
            <h2 className="text-lg font-semibold text-center">{team.tactics}</h2>
        </div>
        <div className={`flex justify-center gap-4`}>
            {forwards.map((forward, index) => (
                <FootballerCard footballer={forward} gameStarted={gameStarted} guessFootballer={guessFootballer} position="forward" key={index} />
            ))}
        </div>
        <div className={`flex justify-center gap-4`}>
            {midfielders.map((midfielder, index) => (
                <FootballerCard footballer={midfielder} gameStarted={gameStarted} guessFootballer={guessFootballer} position="midfielder" key={index} />
            ))}
        </div>
        <div className={`flex justify-center gap-4`}>
            {defenders.map((defender, index) => (
                <FootballerCard footballer={defender} gameStarted={gameStarted} guessFootballer={guessFootballer} position="defender" key={index} />
            ))}
        </div>
        <div className="flex flex-col items-center mt-4">
            <FootballerCard footballer={goalkeeper} gameStarted={gameStarted} guessFootballer={guessFootballer} position="goalkeeper" />
        </div>
    </div>
}