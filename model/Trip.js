"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Trip = /** @class */ (function () {
    function Trip(id, routeId, tripHeadsign) {
        this.id = id;
        this.routeId = routeId;
        this.tripHeadsign = tripHeadsign;
    }
    Trip.prototype.getId = function () {
        return this.id;
    };
    Trip.prototype.getRouteId = function () {
        return this.routeId;
    };
    Trip.prototype.getTripHeadsign = function () {
        return this.tripHeadsign;
    };
    return Trip;
}());
exports.Trip = Trip;
module.exports = Trip;
