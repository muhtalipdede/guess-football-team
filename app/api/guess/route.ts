import Footballer from "@/types/footballer";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const body = request.json();
    const { name, team, season, position } = await body;
    console.log(name, team, season, position);
    const footballers = require("@/data/footballers.json");
    
    const correct = footballers.find((f: any) => f.name === name && f.position === position && f.seasons.find((s: any) => s.season === season.name && s.team === team.name));

    const result = {
        correct: !!correct,
    };

    return new Response(JSON.stringify(result), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}