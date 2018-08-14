export class Stop {
    private readonly id: String;
    private readonly name: String;
    private readonly routeIds: String[];

    constructor(id: String, name: String, routeIds: String[]) {
        this.id = id;
        this.name = name;
        this.routeIds = routeIds;
    }

    public getId(): String {
        return this.id;
    }

    public getName(): String {
        return this.name;
    }

    public getRouteIds(): String[] {
        return this.routeIds;
    }
}

module.exports = Stop;