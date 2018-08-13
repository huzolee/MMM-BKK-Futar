let Route = function (id, shortName, type) {

    this.id = id;
    this.shortName = shortName;
    this.type = type;

    this.getId = function () {
        return this.id;
    };

    this.getShortName = function () {
        return this.shortName;
    };

    this.getType = function () {
        return this.type;
    };
};

module.exports = Route;