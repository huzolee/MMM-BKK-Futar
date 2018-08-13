let StopTime = function (stopHeadsign, arrivalTime, departureTime, predictedArrivalTime,
                         predictedDepartureTime, tripId) {

    this.stopHeadsign = stopHeadsign;
    this.arrivalTime = arrivalTime;
    this.departureTime = departureTime;
    this.predictedArrivalTime = predictedArrivalTime;
    this.predictedDepartureTime = predictedDepartureTime;
    this.tripId = tripId;

    this.getStopHeadsign = function () {
        return this.stopHeadsign;
    };

    this.getArrivalTime = function () {
        return this.arrivalTime;
    };

    this.getDepartureTime = function () {
        return this.departureTime;
    };

    this.getPredictedArrivalTime = function () {
        return this.predictedArrivalTime;
    };

    this.getPredictedDepartureTime = function () {
        return this.predictedDepartureTime;
    };

    this.getTripId = function () {
        return this.tripId;
    };
};

module.exports = StopTime;