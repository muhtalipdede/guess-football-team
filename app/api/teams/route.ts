export const dynamic = 'force-dynamic';

export function GET(request: Request) {
    const teams = require("@/data/teams.json");

    return new Response(JSON.stringify(teams), {
        headers: {
            'content-type': 'application/json'
        }
    });
}