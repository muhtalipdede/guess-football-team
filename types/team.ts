import Footballer from "./footballer";

type Team = {
    name: string;
    season: string;
    goalkeeper: Footballer;
    defenders: Footballer[];
    midfielders: Footballer[];
    forwards: Footballer[];
    tactics: string;
};

export default Team;