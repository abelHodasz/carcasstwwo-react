export default class Player {
    constructor({ name, id, color, meepleCount }) {
        this.score = 0;
        this.name = name;
        this.id = id;
        this.meepleCount = meepleCount;
        this.color = color;
    }
}
