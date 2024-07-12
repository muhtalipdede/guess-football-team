import Team from "@/types/team";

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
    // query parameterdan team ve season al
    const url = new URL(request.url);
    const team = url.searchParams.get('team');
    const season = url.searchParams.get('season');

    if (!team || !season) {
        return new Response('Missing team or season query parameter', {
            status: 400
        });
    }

    // const data = require("@/data/footballers.json");

    // const footballers = data.filter((footballer: any) => {
    //     return footballer.seasons.find((s: any) => s.season === season && s.team === team);
    // });

    // const _team: Team = {
    //     defenders: footballers.filter((footballer: any) => footballer.position === 'defender'),
    //     forwards: footballers.filter((footballer: any) => footballer.position === 'forward'),
    //     goalkeeper: footballers.find((footballer: any) => footballer.position === 'goalkeeper'),
    //     midfielders: footballers.filter((footballer: any) => footballer.position === 'midfielder'),
    //     name: team,
    //     season: season,
    //     tactics: '4/3/3'
    // }

    const _team: Team = {
        defenders: [
            {}, {}, {}, {}
        ],
        forwards: [
            {}, {}, {}
        ],
        goalkeeper: {},
        midfielders: [
            {}, {}, {}
        ],
        tactics: '4/3/3',
        name: team,
        season: season
    }


    return new Response(JSON.stringify(_team), {
        headers: {
            'content-type': 'application/json'
        }
    });
}