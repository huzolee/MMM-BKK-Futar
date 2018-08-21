const NodeHelper = require("node_helper");
const request = require('request');
const StopTime = require("./model/StopTime");
const Stop = require("./model/Stop");
const Route = require("./model/Route");
const Trip = require("./model/Trip");

require('ssl-root-cas').inject();

module.exports = NodeHelper.create({

    start: function () {
        this.stopTimes = [];
        this.stops = [];
        this.routes = [];
        this.trips = [];
        this.config = {};
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "BKKFutarSocketNotificationSenderRegistered") {
            this.config = payload.config
            this.updateDisplay(0);
            return;
        }
    },
    updateDisplay: function (delay) {
        clearTimeout(this.updateTimer);
        const self = this;
        this.updateTimer = setTimeout(function () {
            self.getData();
        }, delay);
    },
    getData: function () {
        const stopIds = this.config['stopIds'];
        let stopIdParams = "";

        for (let i = 0; i < stopIds.length; i++) {
            stopIdParams = stopIdParams.concat("&stopId=", stopIds[i]);
        }

        const self = this;
        request('http://private-amnesiac-025cc-bkkfutar.apiary-proxy.com/bkk-utvonaltervezo-api/ws/otp/api/where/' +
            'arrivals-and-departures-for-stop.json?key=apaiary-test&version=3&appVersion=apiary-1.0&includeReferences=true' +
            '&onlyDepartures=true&limit=60&minutesBefore=0&minutesAfter=30' + stopIdParams,
            function (error, response, body) {
                // if (response.statusCode != 200) {
                //     self.sendSocketNotification("BKK_FUTAR_UNAVAILABLE");
                // }
                self.processData(JSON.parse(body));
            });
    },
    processData: function (body) {
        const currentTime = parseInt(body['currentTime'] / 1000);
        let rowsToDisplay = [];

        this.stopTimes = this.getStopTimes(body['data']['entry']['stopTimes']);
        this.stops = this.getStops(body['data']['references']['stops']);
        this.routes = this.getRoutes(body['data']['references']['routes']);
        this.trips = this.getTrips(body['data']['references']['trips']);

        for (let stop of this.stops) {
            const stopName = stop.getName();
            const stopRouteIds = stop.getRouteIds();

            for (let route of this.routes) {
                const routeId = route.getId();
                if (this.isRouteIdInRouteArray(routeId, stopRouteIds)) {
                    const type = route.getType();
                    const shortName = route.getShortName();

                    for (let trip of this.trips) {
                        if (trip.getRouteId() === routeId) {
                            const tripHeadsign = trip.getTripHeadsign();

                            for (let stopTime of this.stopTimes) {
                                if (trip.getId() === stopTime.getTripId()) {
                                    const predictedArrivalTime = stopTime.getPredictedArrivalTime();
                                    const arrivalTime = stopTime.getArrivalTime();
                                    let waiting;

                                    if (predictedArrivalTime === undefined) {
                                        waiting = parseInt((arrivalTime - currentTime) / 60);
                                    } else {
                                        waiting = parseInt((predictedArrivalTime - currentTime) / 60);
                                    }

                                    if (waiting >= 5 && waiting <= 15) {
                                        rowsToDisplay.push({
                                            stop: stopName,
                                            line: shortName,
                                            stopHead: tripHeadsign,
                                            waiting: waiting
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        rowsToDisplay = this.sortRoutesByWaiting(rowsToDisplay);
        this.sendNotificationForBKKCourier(rowsToDisplay);
        this.updateDisplay(60 * 1000);
    },
    getStopTimes: function (stopTimes) {
        const stopTimeList = [];

        for (let i in stopTimes) {
            const stopHeadsign = stopTimes[i]['stopHeadsign'];
            const arrivalTime = stopTimes[i]['arrivalTime'];
            const departureTime = stopTimes[i]['departureTime'];
            const predictedArrivalTime = stopTimes[i]['predictedArrivalTime'];
            const predictedDepartureTime = stopTimes[i]['predictedDepartureTime'];
            const tripId = stopTimes[i]['tripId'];

            stopTimeList.push(new StopTime(stopHeadsign, arrivalTime, departureTime, predictedArrivalTime,
                predictedDepartureTime, tripId));
        }

        return stopTimeList;
    },
    getStops: function (stops) {
        const stopList = [];

        for (let i in stops) {
            const id = stops[i]['id'];
            const name = stops[i]['name'];
            const routeIds = stops[i]['routeIds'];

            stopList.push(new Stop(id, name, routeIds));
        }

        return stopList;
    },
    getRoutes: function (routes) {
        const routeList = [];

        for (let i in routes) {
            const id = routes[i]['id'];
            const shortName = routes[i]['shortName'];
            const type = routes[i]['type'];

            routeList.push(new Route(id, shortName, type));
        }

        return routeList;
    },
    getTrips: function (trips) {
        const tripList = [];

        for (let i in trips) {
            const id = trips[i]['id'];
            const routeId = trips[i]['routeId'];
            const tripHeadsign = trips[i]['tripHeadsign'];

            tripList.push(new Trip(id, routeId, tripHeadsign));
        }

        return tripList;
    },
    sendNotificationForBKKCourier: function (comingRoutes) {
        this.sendSocketNotification("BKKFutarNotificationSent", comingRoutes);
    },
    isRouteIdInRouteArray: function (routeId, routeIds) {
        for (let rId of routeIds) {
            if (rId === routeId) {
                return true;
            }
        }

        return false;
    },
    sortRoutesByWaiting: function (comingRoutes) {
        return comingRoutes = comingRoutes.sort(this.compareFunc);
    },
    compareFunc: function (a, b) {
        return a['waiting'] - b['waiting'];
    }
});
