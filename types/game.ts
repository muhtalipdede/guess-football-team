import Player from "./player";
import Season from "./season";
import Team from "./team";

type Game = {
    code: string;
    players: Player[];
    season: Season;
    team: Team;
};

export default Game;