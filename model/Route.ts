export class Route {

    private readonly id: String;
    private readonly shortName: String;
    private readonly type: String;

    constructor(id: String, shortName: String, type: String) {
        this.id = id;
        this.shortName = shortName;
        this.type = type;
    }

    public getId(): String {
        return this.id;
    }

    public getShortName(): String {
        return this.shortName;
    }

    public getType() {
        return this.type;
    }
}

module.exports = Route;