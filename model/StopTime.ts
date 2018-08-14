export class StopTime {

    private readonly stopHeadsign: String;
    private readonly arrivalTime: Date;
    private readonly departureTime: Date;
    private readonly predictedArrivalTime: Date;
    private readonly predictedDepartureTime: Date;
    private readonly tripId: String;

    constructor(stopHeadsign: String, arrivalTime: Date, departureTime: Date, predictedArrivalTime: Date,
                predictedDepartureTime: Date, tripId: String) {
        this.stopHeadsign = stopHeadsign;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.predictedArrivalTime = predictedArrivalTime;
        this.predictedDepartureTime = predictedDepartureTime;
        this.tripId = tripId;
    }

    public getStopHeadsign(): String {
        return this.stopHeadsign;
    }

    public getArrivalTime(): Date {
        return this.arrivalTime;
    }

    public getDepartureTime(): Date {
        return this.departureTime;
    }

    public getPredictedArrivalTime(): Date {
        return this.predictedArrivalTime;
    }

    public getPredictedDepartureTime(): Date {
        return this.predictedDepartureTime;
    }

    public getTripId(): String {
        return this.tripId;
    }
}

module.exports = StopTime;