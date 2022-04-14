import fetch from 'node-fetch';
import Route from './types/Route';
import Stop from './types/Stop';
import StopTime from './types/StopTime';
import Trip from './types/Trip';
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
  start(): void {
    this.stopTimes = [];
    this.stops = [];
    this.routes = [];
    this.trips = [];
    this.config = {};
  },

  socketNotificationReceived(notification: any, payload: any): void {
    if (notification === 'BudapestGoSocNotRegistered') {
      this.config = payload.config;
      this.updateDisplay(0);
    }
  },

  updateDisplay(delay: number): void {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => this.getData(), delay);
  },

  getData(): void {
    const stopIds = this.config['stopIds'];
    let stopIdParams = '';

    for (let i = 0; i < stopIds.length; i++) {
      stopIdParams = stopIdParams.concat('&stopId=', stopIds[i]);
    }

    const self = this;

    fetch(
      'https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop.json?routes,trips,stops&minutesBefore=1&minutesAfter=30&stopId=BKK_F01219' +
        stopIdParams,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        self.processData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },

  processData(body: any): void {
    const currentTime: number = body['currentTime'];
    let rowsToDisplay: any[] = [];

    this.stopTimes = this.getStopTimes(body['data']['entry']['stopTimes']);
    this.stops = this.getStops(body['data']['references']['stops']);
    this.routes = this.getRoutes(body['data']['references']['routes']);
    this.trips = this.getTrips(body['data']['references']['trips']);

    for (let stop of this.stops) {
      const stopName: string = stop.name;
      const stopRouteIds: string[] = stop.routeIds;

      for (let route of this.routes) {
        const routeId: string = route.id;

        if (this.isRouteIdInRouteArray(routeId, stopRouteIds)) {
          const shortName: string = route.shortName;

          for (let trip of this.trips) {
            if (trip.routeId === routeId) {
              const tripHeadsign: string = trip.tripHeadsign;

              for (let stopTime of this.stopTimes) {
                if (trip.id === stopTime.tripId) {
                  let timeToDeparture: number;
                  const predictedDepartureTime: Date = stopTime.predictedDepartureTime;

                  if (!predictedDepartureTime) {
                    timeToDeparture = stopTime.departureTime.getTime() - currentTime;
                  } else {
                    timeToDeparture = predictedDepartureTime.getTime() - currentTime;
                  }

                  const timeToDepartureInMins = Math.trunc(timeToDeparture / 1000 / 60);

                  if (timeToDepartureInMins >= 5 && timeToDepartureInMins <= 15) {
                    rowsToDisplay.push({
                      stop: stopName,
                      line: shortName,
                      stopHead: tripHeadsign,
                      waiting: timeToDepartureInMins,
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

  getStopTimes(stopTimes: any): StopTime[] {
    const stopTimeList: StopTime[] = [];

    for (let i in stopTimes) {
      stopTimeList.push({
        stopHeadsign: stopTimes[i]['stopHeadsign'],
        departureTime: stopTimes[i]['departureTime']
          ? new Date(stopTimes[i]['departureTime'] * 1000)
          : undefined,
        predictedDepartureTime: stopTimes[i]['predictedDepartureTime']
          ? new Date(stopTimes[i]['predictedDepartureTime'] * 1000)
          : undefined,
        tripId: stopTimes[i]['tripId'],
      });
    }

    return stopTimeList;
  },

  getStops(stops: any): Stop[] {
    const stopList: Stop[] = [];

    for (let i in stops) {
      stopList.push({ id: stops[i]['id'], name: stops[i]['name'], routeIds: stops[i]['routeIds'] });
    }

    return stopList;
  },

  getRoutes(routes: any): Route[] {
    const routeList: Route[] = [];

    for (let i in routes) {
      routeList.push({
        id: routes[i]['id'],
        shortName: routes[i]['shortName'],
        type: routes[i]['type'],
      });
    }

    return routeList;
  },

  getTrips(trips: any): Trip[] {
    const tripList: Trip[] = [];

    for (let i in trips) {
      tripList.push({
        id: trips[i]['id'],
        routeId: trips[i]['routeId'],
        tripHeadsign: trips[i]['tripHeadsign'],
      });
    }

    return tripList;
  },

  sendNotificationForBKKCourier(comingRoutes: any): void {
    this.sendSocketNotification('BKKFutarNotificationSent', comingRoutes);
  },

  isRouteIdInRouteArray(routeId: number, routeIds: number[]): boolean {
    return routeIds.includes(routeId) ? true : false;
  },

  sortRoutesByWaiting(comingRoutes: any): any {
    return (comingRoutes = comingRoutes.sort(this.compareFunc));
  },

  compareFunc: function (a: any, b: any) {
    return a['waiting'] - b['waiting'];
  },
});
