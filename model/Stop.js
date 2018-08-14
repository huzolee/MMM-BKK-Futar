"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stop = /** @class */ (function () {
    function Stop(id, name, routeIds) {
        this.id = id;
        this.name = name;
        this.routeIds = routeIds;
    }
    Stop.prototype.getId = function () {
        return this.id;
    };
    Stop.prototype.getName = function () {
        return this.name;
    };
    Stop.prototype.getRouteIds = function () {
        return this.routeIds;
    };
    return Stop;
}());
exports.Stop = Stop;
module.exports = Stop;
