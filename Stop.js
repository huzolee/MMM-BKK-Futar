let Stop = function (id, name, routeIds) {

    // Pl.: ["BKK_F02745","BKK_F02971","BKK_F02972","BKK_F02973","BKK_F02750","BKK_F02752","BKK_F02753"]
    this.id = id;
    this.name = name;
    this.routeIds = routeIds;

    this.getId = function () {
        return this.id;
    };

    this.getName = function () {
        return this.name;
    };

    this.getRouteIds = function () {
        return this.routeIds;
    };
};

module.exports = Stop;