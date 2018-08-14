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
            this.updateSchedule(0);
            return;
        }
    },
    updateSchedule: function (delay) {
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
        const currentTime = new Date(body['currentTime']);
        const headers = {stop: "Megálló:", line: "Járat:", stopHead: "Végállomás:", waiting: "Érkezik:"};
        const rowsToDisplay = [];
        rowsToDisplay.push(headers);

        this.stopTimes = this.getStopTimes(body['data']['entry']['stopTimes']);
        this.stops = this.getStops(body['data']['references']['stops']);
        this.routes = this.getRoutes(body['data']['references']['routes']);
        this.trips = this.getTrips(body['data']['references']['trips']);
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

        console.log('tripList', tripList);

        return tripList;
    },
    sendNotificationForBKKCourier: function () {
        this.sendSocketNotification("BKKFutarNotificationSent", this.bustimes);
    }
});
