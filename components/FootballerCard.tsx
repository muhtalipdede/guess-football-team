import Footballer from "@/types/footballer";
import { useState } from "react";

export default function FootballerCard({ footballer, gameStarted, position, guessFootballer }: { footballer: Footballer, gameStarted: boolean, position: string, guessFootballer: (name: string, position: string) => void }) {
    console.log(footballer);
    const [selected, setSelected] = useState<boolean>(false);
    const [guess, setGuess] = useState<string>("");
    const [footballersSearchResults, setFootballersSearchResults] = useState<Footballer[]>([]);

    const fetchFootballers = async (query: string) => {
        const res = await fetch(`/api/footballers?name=${query}`);
        const data = await res.json();
        setFootballersSearchResults(data);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuess(e.target.value);
        if (e.target.value.length > 2) {
            fetchFootballers(e.target.value);
        } else {
            setFootballersSearchResults([]);
        }
    }

    const handleSelect = (footballer: Footballer) => {
        if (gameStarted) {
            setFootballersSearchResults([]);
            setSelected(!selected);
        } else {
            alert("The game has not started yet!");
        }
    }

    return (
        <>
            {selected && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 flex flex-col items-center justify-center gap-4">
                    <input type="text" placeholder="Enter the footballer's name" className="border-2 border-blue-500 rounded-lg px-4 py-2 text-black" value={guess} onChange={handleInputChange} />
                    <div className="flex flex-col gap-4">
                        {footballersSearchResults.map((footballer) => (
                            <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg gap-4" key={footballer.name}>
                                <p className="text-black">{footballer.name}</p>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    onClick={() => footballer.name && guessFootballer(footballer.name, position)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => footballer.name && guessFootballer(footballer.name, position)}
                        >
                            Guess
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => setSelected(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <div
                className={`flex items-center justify-center w-24 h-24 bg-white rounded-lg shadow-lg ${selected ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleSelect(footballer)}
            >
                <img src={"https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"} alt={footballer.name} className="w-16 h-16" />
            </div>
        </>
    );
}