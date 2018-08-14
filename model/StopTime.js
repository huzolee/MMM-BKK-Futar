"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StopTime = /** @class */ (function () {
    function StopTime(stopHeadsign, arrivalTime, departureTime, predictedArrivalTime, predictedDepartureTime, tripId) {
        this.stopHeadsign = stopHeadsign;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.predictedArrivalTime = predictedArrivalTime;
        this.predictedDepartureTime = predictedDepartureTime;
        this.tripId = tripId;
    }
    StopTime.prototype.getStopHeadsign = function () {
        return this.stopHeadsign;
    };
    StopTime.prototype.getArrivalTime = function () {
        return this.arrivalTime;
    };
    StopTime.prototype.getDepartureTime = function () {
        return this.departureTime;
    };
    StopTime.prototype.getPredictedArrivalTime = function () {
        return this.predictedArrivalTime;
    };
    StopTime.prototype.getPredictedDepartureTime = function () {
        return this.predictedDepartureTime;
    };
    StopTime.prototype.getTripId = function () {
        return this.tripId;
    };
    return StopTime;
}());
exports.StopTime = StopTime;
module.exports = StopTime;
