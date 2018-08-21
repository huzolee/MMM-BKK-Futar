Module.register('MMM-BKK-Futar', {

    defaults: {
        comingRoutes: []
    },
    getStyles: function () {
        return ['futar.css'];
    },
    getTemplate: function () {
        return 'courierTemplate.njk'
    },
    getTemplateData: function () {
        return this.config;
    },
    start: function () {
        this.registerSocketNotificationSender();
    },
    registerSocketNotificationSender: function () {
        this.sendSocketNotification("BKKFutarSocketNotificationSenderRegistered", {
            config: this.config
        });
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "BKKFutarNotificationSent") {
            this.config.comingRoutes = payload;
            this.updateDom();
        }
    },
});
