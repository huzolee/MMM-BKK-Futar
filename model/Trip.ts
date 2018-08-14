export class Trip {

    private readonly id: String;
    private readonly routeId: String;
    private readonly tripHeadsign: String;

    constructor(id: String, routeId: String, tripHeadsign: String) {
        this.id = id;
        this.routeId = routeId;
        this.tripHeadsign = tripHeadsign;
    }

    public getId(): String {
        return this.id;
    }

    public getRouteId(): String {
        return this.routeId;
    }

    public getTripHeadsign(): String {
        return this.tripHeadsign;
    }
}

module.exports = Trip;