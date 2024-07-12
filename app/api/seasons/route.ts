export const dynamic = 'force-dynamic';

export function GET(request: Request) {
    const seasons = require("@/data/seasons.json");

    return new Response(JSON.stringify(seasons), {
        headers: {
            'content-type': 'application/json'
        }
    });
}