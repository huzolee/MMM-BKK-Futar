"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Route = /** @class */ (function () {
    function Route(id, shortName, type) {
        this.id = id;
        this.shortName = shortName;
        this.type = type;
    }
    Route.prototype.getId = function () {
        return this.id;
    };
    Route.prototype.getShortName = function () {
        return this.shortName;
    };
    Route.prototype.getType = function () {
        return this.type;
    };
    return Route;
}());
exports.Route = Route;
module.exports = Route;
