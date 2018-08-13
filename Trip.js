let Trip = function (id, routeId, tripHeadsign) {

    this.id = id;
    this.routeId = routeId;
    this.tripHeadsign = tripHeadsign;

    this.getId = function () {
        return this.id;
    };

    this.getRouteId = function () {
        return this.routeId;
    };

    this.getTripHeadsign = function () {
        return this.tripHeadsign;
    };
};

module.exports = Trip;