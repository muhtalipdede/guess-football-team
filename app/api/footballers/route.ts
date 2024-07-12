export const dynamic = 'force-dynamic';

export function GET(request: Request) {
    var query = new URL(request.url).searchParams;
    const name = query.get('name');
    console.log(name);
    if (!name) {
        return new Response('Name query parameter is required', { status: 400 });
    }

    // data klasörü altındaki footballers.json dosyasını okuyoruz ve gelen query parametresine göre filtreliyoruz
    const data = require("@/data/footballers.json");
    const footballers = data.filter((footballer: any) => {
        return footballer.name.toLowerCase().includes(name.toLowerCase());
    });

    return new Response(JSON.stringify(footballers), {
        headers: {
            'content-type': 'application/json'
        }
    });
}