import { getColors } from "./Color";

const colors = getColors();

export default class Player {
    constructor(name, id) {
        this.score = 0;
        this.name = name;
        this.id = id;
        this.meeples = 7;
        this.color = colors.next().value;
    }
}
