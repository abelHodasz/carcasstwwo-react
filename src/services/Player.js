export default class Player {
    constructor({name, id, me, color, meepleCount}) {
        this.score = 0;
        this.name = name;
        this.me = me;
        this.id = id;
        this.meepleCount = meepleCount;
        this.color = color;
    }
}
